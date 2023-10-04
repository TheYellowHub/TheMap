import { useEffect, useRef, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";

import useGoogleMaps, { Location } from "../../../utils/googleMaps/useGoogleMaps";
import useDoctorCategories from "../../../hooks/doctors/useDoctorCategories";
import useDoctorSpecialities from "../../../hooks/doctors/useDoctorSpecialities";
import { DistanceUnit } from "../../utils/DistanceUnit";
import { DoctorCategory } from "../../../types/doctors/doctorCategory";
import { DoctorSpeciality } from "../../../types/doctors/DoctorSpeciality";
import { Doctor, getDoctorMinimalDistance } from "../../../types/doctors/doctor";
import AddressInputFormField from "../../utils/form/addressField";
import ComboboxFormField from "../../utils/form/comboboxField";
import CheckboxesGroupFormField from "../../utils/form/checkboxesGroupField";
import InputFormField from "../../utils/form/inputField";
import Icon from "../../utils/Icon";

interface DoctorSearchFiltersProps {
    address: string | undefined;
    setAddress: (address: string) => void;
    addressLocation: Location | undefined;
    setAddressLocation: (addressLocation: Location | undefined) => void;
    distance: number | undefined;
    setDistance: (distance: number | undefined) => void;
    distanceUnit: DistanceUnit;
    doctors: Doctor[];
    setMatchedDoctorsIgnoringDistance: (doctors: Doctor[]) => void;
    setMatchedDoctorsIncludingDistance: (doctors: Doctor[]) => void;
    shouldClearFilters: boolean;
    setShouldClearFilters: (shouldClearFilters: boolean) => void;
}

export default function DoctorSearchFilters({
    address,
    setAddress,
    addressLocation,
    setAddressLocation,
    distance,
    setDistance,
    distanceUnit,
    doctors,
    setMatchedDoctorsIgnoringDistance,
    setMatchedDoctorsIncludingDistance,
    shouldClearFilters,
    setShouldClearFilters,
}: DoctorSearchFiltersProps) {
    const { data: categories } = useDoctorCategories();
    const { data: specialities } = useDoctorSpecialities();
    const { setCurrentLocation, getAddress, getLocation, getDistance, isLoaded: isGoogleMapsLoaded } = useGoogleMaps();

    const formRef = useRef<HTMLFormElement>(null);

    const [nameIncludes, setNameIncluds] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
    const [specialitiesFilter, setSpecialitiesFilter] = useState<string[]>([]);

    const [sortKey, setSortKey] = useState<string>("Name");

    const sortOptions: Map<string, (a: Doctor, b: Doctor) => number> = new Map([
        [
            "Name",
            (a, b) => {
                return a.fullName < b.fullName ? 1 : a.fullName > b.fullName ? -1 : 0;
            },
        ],
        [
            "ID",
            (a, b) => {
                return (a.id === undefined ? 0 : a.id) - (b.id === undefined ? 0 : b.id);
            },
        ],
        [
            "Distance",
            (a, b) => {
                if (addressLocation === undefined) {
                    return 0;
                } else {
                    const distanceA = getDoctorMinimalDistance(a, addressLocation, distanceUnit);
                    const distanceB = getDoctorMinimalDistance(b, addressLocation, distanceUnit);
                    return distanceA < distanceB ? -1 : distanceB < distanceA ? 1 : 0;
                }
            },
        ],
    ]);

    const useCurrenetLocation = () => {
        setCurrentLocation((location: Location) => {
            setAddressLocation(location);
            getAddress(location).then((address) => {
                if (address !== undefined) {
                    setAddress(address);
                }
            });
        });
    };

    useEffect(() => {
        if (shouldClearFilters) {
            formRef?.current?.reset();
            setNameIncluds("");
            setCategoryFilter(undefined);
            setSpecialitiesFilter([]);
            setShouldClearFilters(false);
        }
    }, [shouldClearFilters]);

    useEffect(() => {
        const newMatchedDoctorsIgnoringDistance: Doctor[] = doctors.filter((doctor: Doctor) => {
            return (
                doctor.status === "APPROVED" &&
                doctor.fullName?.toLowerCase().includes(nameIncludes.toLowerCase()) &&
                (categoryFilter === undefined || categoryFilter === doctor.category) &&
                specialitiesFilter.every((speciality) => doctor.specialities.includes(speciality))
            );
        });
        setMatchedDoctorsIgnoringDistance(newMatchedDoctorsIgnoringDistance);

        const newMatchedDoctorsIncludingDistance: Doctor[] = newMatchedDoctorsIgnoringDistance
            .filter((doctor: Doctor) => {
                const doctorDistance =
                    distance === undefined || addressLocation === undefined
                        ? undefined
                        : getDoctorMinimalDistance(doctor, addressLocation, distanceUnit);
                return (
                    distance === undefined ||
                    addressLocation === undefined ||
                    (doctorDistance && doctorDistance <= distance)
                );
            })
            .sort(sortOptions.get(sortKey));

        setMatchedDoctorsIncludingDistance(newMatchedDoctorsIncludingDistance);
    }, [doctors, addressLocation, distance, nameIncludes, categoryFilter, specialitiesFilter, sortKey]);

    return (
        <Form ref={formRef}>
            <Form.Group as={Row}>
                <Col sm={9}>
                    <AddressInputFormField<undefined>
                        field={{
                            type: "address",
                            label: "address",
                            getter: () => address,
                            setter: (_: undefined, newAddress: string) => {
                                setAddress(newAddress);
                                getLocation(newAddress).then((location) => setAddressLocation(location));
                                return undefined;
                            },
                        }}
                        object={undefined}
                    />
                </Col>
                <Col sm={3}>
                    <a href="#" onClick={useCurrenetLocation}>
                        Use my location
                    </a>
                </Col>
            </Form.Group>

            {/* {location && (
                <Form.Group as={Row}>
                    <Form.Label column htmlFor="distance">
                        Distance
                    </Form.Label>
                    <Col sm={7}>
                        <Form.Control
                            type="number"
                            id="distance"
                            value={distance}
                            onChange={(e) => setDistance(e.target.value ? Number(e.target.value) : undefined)}
                        />
                    </Col>
                    <Col sm={2}>{distanceUnit}</Col>
                </Form.Group>
            )} */}

            <Form.Group as={Row}>
                <Col sm={9}>
                    <InputFormField<undefined>
                        field={{
                            type: "text",
                            label: "name",
                            getter: () => nameIncludes,
                            setter: (_: undefined, newNameIncluds: string) => {
                                setNameIncluds(newNameIncluds);
                                return undefined;
                            },
                        }}
                        object={undefined}
                        placeHolder="Doctor's name"
                    />
                </Col>
            </Form.Group>

            <Form.Group as={Row}>
                <Form.Label column>Category</Form.Label>
                <Col sm={9}>
                    <ComboboxFormField
                        field={{
                            type: "combobox",
                            label: "Category",
                            getter: () => categoryFilter,
                            setter: (_, newCategory: string | undefined) => setCategoryFilter(newCategory) as undefined,
                            options: categories.map((category: DoctorCategory) => {
                                return { key: category.name, value: category.name };
                            }),
                        }}
                        object={undefined}
                        allowEmptySelection={true}
                    />
                </Col>
            </Form.Group>

            <Form.Group as={Row}>
                <Form.Label column>Specialities</Form.Label>
                <Col sm={9}>
                    <CheckboxesGroupFormField
                        field={{
                            type: "checkboxesGroup",
                            label: "Specialities",
                            getter: () => specialitiesFilter,
                            setter: (_, newSpecialities: string[]) =>
                                setSpecialitiesFilter(newSpecialities) as undefined,
                            options: specialities.map((speciality: DoctorSpeciality) => {
                                return { key: speciality.name, value: speciality.name };
                            }),
                        }}
                        object={undefined}
                    />
                </Col>
            </Form.Group>

            <Form.Group as={Row}>
                <Form.Label column htmlFor="sort-by-select">
                    Sort by
                </Form.Label>
                <Col sm={9}>
                    <select
                        id="sort-by-select"
                        className="form-select"
                        defaultValue={sortKey}
                        onChange={(e) => setSortKey(e.target.value)}
                    >
                        {Array.from(sortOptions.keys()).map((sortKey) => (
                            <option value={sortKey} key={sortKey}>
                                {sortKey}
                            </option>
                        ))}
                    </select>
                </Col>
            </Form.Group>

            <Row>
                <div className="d-flex justify-content-end">
                    <a href="#" onClick={() => setShouldClearFilters(true)}>
                        <Icon icon="fa-close" />
                        Clear all
                    </a>
                </div>
            </Row>
        </Form>
    );
}
