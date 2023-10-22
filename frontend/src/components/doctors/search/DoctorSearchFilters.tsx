import { useEffect, useRef, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import useDoctorCategories from "../../../hooks/doctors/useDoctorCategories";
import useDoctorSpecialities from "../../../hooks/doctors/useDoctorSpecialities";
import { DistanceUnit } from "../../utils/DistanceUnit";
import { DoctorCategory } from "../../../types/doctors/doctorCategory";
import { DoctorSpeciality } from "../../../types/doctors/DoctorSpeciality";
import { Doctor, getDoctorMinimalDistance } from "../../../types/doctors/doctor";
import ComboboxFormField from "../../utils/form/comboboxField";
import Icon from "../../utils/Icon";
import DoctorSearchAddressFilter from "./DoctorSearchAddressFilter";
import MultiSelectDropdownField from "../../utils/form/multiSelectDropdownField";

interface DoctorSearchFiltersProps {
    address: string | undefined;
    setAddress: (address: string) => void;
    addressLocation: Location | undefined;
    setAddressLocation: (addressLocation: Location | undefined) => void;
    useCurrenetLocation: () => void;
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
    useCurrenetLocation,
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

    const formRef = useRef<HTMLFormElement>(null);

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

    useEffect(() => {
        if (shouldClearFilters) {
            formRef?.current?.reset();
            setCategoryFilter(undefined);
            setSpecialitiesFilter([]);
            setShouldClearFilters(false);
        }
    }, [shouldClearFilters]);

    useEffect(() => {
        const newMatchedDoctorsIgnoringDistance: Doctor[] = doctors.filter((doctor: Doctor) => {
            return (
                doctor.status === "APPROVED" &&
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
    }, [doctors, addressLocation, distance, categoryFilter, specialitiesFilter, sortKey]);

    return (
        <Form ref={formRef}>
            <Container fluid>
                <Row>
                    <Col className="small-address-filter">
                        <DoctorSearchAddressFilter
                            address={address}
                            setAddress={setAddress}
                            addressLocation={addressLocation}
                            setAddressLocation={setAddressLocation}
                            useCurrenetLocation={useCurrenetLocation}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col sm={3}>
                        <ComboboxFormField
                            field={{
                                type: "combobox",
                                label: "Category",
                                getter: () => categoryFilter,
                                setter: (_, newCategory: string | undefined) =>
                                    setCategoryFilter(newCategory) as undefined,
                                options: categories.map((category: DoctorCategory) => {
                                    return { key: category.name, value: category.name };
                                }),
                            }}
                            object={undefined}
                            allowEmptySelection={true}
                            placeHolder="All Categories"
                        />
                    </Col>
                    <Col sm={3}>
                        <MultiSelectDropdownField
                            field={{
                                type: "multiSelect",
                                label: "Specialities",
                                getter: () => specialitiesFilter,
                                setter: (_, newSpecialities: string[]) =>
                                    setSpecialitiesFilter(newSpecialities) as undefined,
                                options: specialities.map((speciality: DoctorSpeciality) => {
                                    return { key: speciality.name, value: speciality.name };
                                }),
                            }}
                            object={undefined}
                            placeHolder="All specialities"
                        />
                    </Col>
                    <Col sm={3}>
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
                    <Col sm={3} className="justify-content-end">
                        <a href="#" onClick={() => setShouldClearFilters(true)}>
                            <Icon icon="fa-close" />
                            Clear all
                        </a>
                    </Col>
                </Row>
            </Container>
        </Form>
    );
}
