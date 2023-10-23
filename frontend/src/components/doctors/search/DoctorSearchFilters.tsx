import { useEffect, useRef, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import useDoctorCategories from "../../../hooks/doctors/useDoctorCategories";
import useDoctorSpecialities from "../../../hooks/doctors/useDoctorSpecialities";
import { DistanceUnit } from "../../utils/DistanceUnit";
import { DoctorSpeciality } from "../../../types/doctors/DoctorSpeciality";
import { Doctor, getDoctorMinimalDistance, getDoctorNameWithoutPrefix } from "../../../types/doctors/doctor";
import Icon from "../../utils/Icon";
import DoctorSearchAddressFilter from "./DoctorSearchAddressFilter";
import MultiSelectField from "../../utils/form/multiSelectFormField";
import Select from "../../utils/Select";
import { DoctorCategory } from "../../../types/doctors/doctorCategory";

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

    const [listFilter, setListFilter] = useState<string | undefined>();

    const defaultSortKey = "Closest first";
    const [sortKey, setSortKey] = useState<string>(defaultSortKey);

    const listOptions: ReadonlyMap<string, (doctor: Doctor) => boolean> = new Map([
        ["icarebetter.com", (doctor: Doctor) => Boolean(doctor.iCareBetter)],
        ["Nancy’s Nook", (doctor: Doctor) => doctor.nancysNook === true],
    ]);

    const sortByName = (a: Doctor, b: Doctor) => {
        const nameA = getDoctorNameWithoutPrefix(a);
        const nameB = getDoctorNameWithoutPrefix(b);
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    };

    const sortOptions: ReadonlyMap<string, (a: Doctor, b: Doctor) => number> = new Map([
        [
            defaultSortKey, // "Closest first",
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
        ["A - Z", (a, b) => sortByName(a, b)],
        ["Z - A", (a, b) => -sortByName(a, b)],
    ]);

    useEffect(() => {
        if (shouldClearFilters) {
            formRef?.current?.reset();
            setCategoryFilter(undefined);
            setSpecialitiesFilter([]);
            setListFilter(undefined);
            setShouldClearFilters(false);
        }
    }, [shouldClearFilters]);

    useEffect(() => {
        const newMatchedDoctorsIgnoringDistance: Doctor[] = doctors.filter((doctor: Doctor) => {
            return (
                doctor.status === "APPROVED" &&
                (categoryFilter === undefined || categoryFilter === doctor.category) &&
                specialitiesFilter.every((speciality) => doctor.specialities.includes(speciality)) &&
                (listFilter === undefined ||
                    listOptions.get(listFilter) === undefined ||
                    listOptions.get(listFilter)!(doctor))
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
    }, [doctors, addressLocation, distance, categoryFilter, specialitiesFilter, listFilter, sortKey]);

    return (
        <Form ref={formRef} className="px-0 mx-0">
            <Container className="d-grid gap-3" fluid>
                <Row className="d-flex px-0">
                    <Col className="small-address-filter px-0">
                        <DoctorSearchAddressFilter
                            address={address}
                            setAddress={setAddress}
                            addressLocation={addressLocation}
                            setAddressLocation={setAddressLocation}
                            useCurrenetLocation={useCurrenetLocation}
                        />
                    </Col>
                </Row>
                <Row className="d-flex gap-3 justify-content-between">
                    <Col sm={6} lg={3} className="px-0">
                        <Select
                            values={categories.map((category: DoctorCategory) => category.name)}
                            currentValue={categoryFilter}
                            allowEmptySelection={true}
                            placeHolder="All Categories"
                            onChange={setCategoryFilter}
                        />
                    </Col>
                    <Col sm={5} lg={3} className="px-0">
                        <Select
                            values={specialities.map((speciality: DoctorSpeciality) => speciality.name)}
                            currentValue={specialitiesFilter}
                            allowEmptySelection={true}
                            placeHolder="All specialities"
                            title="Specialities"
                            onChange={setSpecialitiesFilter}
                            isMulti={true}
                        />
                    </Col>
                    <Col sm={6} lg={2} className="px-0">
                        <Select
                            values={Array.from(listOptions.keys())}
                            currentValue={listFilter}
                            allowEmptySelection={true}
                            placeHolder="All Lists"
                            onChange={(newValue: string | undefined) => setListFilter(newValue)}
                        />
                    </Col>
                    <Col sm={5} lg={3} className="d-flex align-items-center justify-content-end ps-0 pe-1">
                        <Col className="d-flex justify-content-end icon-select">
                            <Select
                                values={Array.from(sortOptions.keys())}
                                onChange={setSortKey as (newValue: string | undefined) => void}
                                currentValue={sortKey}
                                icon="fa-arrow-down-wide-short"
                            />
                        </Col>
                        <Col className="d-flex justify-content-end nowrap">
                            <a href="#" onClick={() => setShouldClearFilters(true)}>
                                <Icon icon="fa-close" />
                                Clear all
                            </a>
                        </Col>
                    </Col>
                </Row>
            </Container>
        </Form>
    );
}
