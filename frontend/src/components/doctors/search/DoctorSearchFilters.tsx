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
import Select from "../../utils/Select";
import { DoctorCategory } from "../../../types/doctors/doctorCategory";
import useAuth from "../../../auth/useAuth";
import useUser from "../../../hooks/auth/useUsers";

interface DoctorSearchFiltersProps {
    address: string | undefined;
    setAddress: (address: string) => void;
    addressLocation: Location | undefined;
    setAddressLocation: (addressLocation: Location | undefined) => void;
    useCurrenetLocation: () => void;
    distance: number | undefined;
    setDistance: (distance: number | undefined) => void;
    distanceUnit: DistanceUnit;
    startWithMyList: boolean;
    listFilter: string | undefined;
    setListFilter: (listFilter: string | undefined) => void;
    myListFilterName: string;
    doctors: Doctor[];
    setMatchedDoctorsIgnoringDistance: (doctors: Doctor[]) => void;
    setMatchedDoctorsIncludingDistance: (doctors: Doctor[]) => void;
    shouldClearFilters: boolean;
    setShouldClearFilters: (shouldClearFilters: boolean) => void;
    shouldClearAddress: boolean;
    setShouldClearAddress: (shouldClearAddress: boolean) => void;
    setValueChange: (filterChange: boolean) => void;
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
    startWithMyList,
    listFilter,
    setListFilter,
    myListFilterName,
    setMatchedDoctorsIgnoringDistance,
    setMatchedDoctorsIncludingDistance,
    shouldClearFilters,
    setShouldClearFilters,
    shouldClearAddress,
    setShouldClearAddress,
    setValueChange,
}: DoctorSearchFiltersProps) {
    const { data: categories } = useDoctorCategories();
    const { data: specialities } = useDoctorSpecialities();

    const { user } = useAuth();
    const { userInfo } = useUser(user);

    const formRef = useRef<HTMLFormElement>(null);

    const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
    const [specialitiesFilter, setSpecialitiesFilter] = useState<string[]>([]);

    const defaultSortKey = "Closest first";
    const [sortKey, setSortKey] = useState<string>(defaultSortKey);

    const [startWithMyListParamWasUsed, setStartWithMyListParamWasUsed] = useState(false);

    const listOptions: ReadonlyMap<string, (doctor: Doctor) => boolean> = new Map([
        ["icarebetter.com", (doctor: Doctor) => Boolean(doctor.iCareBetter)],
        ["Nancy’s Nook", (doctor: Doctor) => doctor.nancysNook === true],
        [myListFilterName, (doctor: Doctor) => userInfo?.savedDoctors?.includes(doctor.id!) === true],
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
        setStartWithMyListParamWasUsed(false);
        setShouldClearFilters(true);
        setShouldClearAddress(true);
    }, [startWithMyList]);

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
    }, [doctors, addressLocation, distance, categoryFilter, specialitiesFilter, listFilter, sortKey, userInfo]);

    useEffect(() => {
        if (shouldClearFilters) {
            formRef?.current?.reset();
            setCategoryFilter(undefined);
            setSpecialitiesFilter([]);
            if (startWithMyListParamWasUsed) {
                setListFilter(undefined);
            } else {
                setListFilter(startWithMyList ? myListFilterName : undefined);
                setStartWithMyListParamWasUsed(true);
            }
            setShouldClearFilters(false);
        }
    }, [shouldClearFilters]);

    return (
        <Form ref={formRef} className="px-0 mx-0">
            <Container className="d-grid gap-3">
                <Row className="d-flex">
                    <Col className="small-address-filter">
                        <DoctorSearchAddressFilter
                            address={address}
                            setAddress={setAddress}
                            addressLocation={addressLocation}
                            setAddressLocation={setAddressLocation}
                            useCurrenetLocation={useCurrenetLocation}
                            setValueChange={setValueChange}
                        />
                    </Col>
                </Row>
                <Row className="d-flex gap-3 justify-content-between flex-lg-nowrap">
                    <Col xs={6} lg={3} className="px-0">
                        <Select
                            values={categories.map((category: DoctorCategory) => category.name)}
                            currentValue={categoryFilter}
                            allowEmptySelection={true}
                            placeHolder="All Categories"
                            onChange={(newValue: string | undefined) => {
                                setCategoryFilter(newValue);
                                setValueChange(true);
                            }}
                        />
                    </Col>
                    <Col xs={5} lg={3} className="px-0">
                        <Select
                            values={specialities.map((speciality: DoctorSpeciality) => speciality.name)}
                            currentValue={specialitiesFilter}
                            allowEmptySelection={true}
                            placeHolder="All specialities"
                            title="Specialities"
                            onChange={(newValue: string[]) => {
                                setSpecialitiesFilter(newValue);
                                setValueChange(true);
                            }}
                            isMulti={true}
                        />
                    </Col>
                    <Col xs={6} lg={2} className="px-0">
                        <Select
                            values={Array.from(listOptions.keys())}
                            currentValue={listFilter}
                            allowEmptySelection={true}
                            placeHolder="All Lists"
                            onChange={(newValue: string | undefined) => {
                                setListFilter(newValue);
                                setValueChange(true);
                            }}
                        />
                    </Col>
                    <Col xs={5} lg={3} className="d-flex align-items-center justify-content-end ps-0 pe-1">
                        <Col className="d-flex justify-content-end icon-select flex-grow-0">
                            <Select
                                values={Array.from(sortOptions.keys())}
                                onChange={(newValue: string | undefined) => {
                                    (setSortKey as (newValue: string | undefined) => void)(newValue);
                                    setValueChange(true);
                                }}
                                currentValue={sortKey}
                                icon="fa-arrow-down-wide-short"
                            />
                        </Col>
                        <Col className="d-flex justify-content-end text-nowrap flex-grow-0">
                            <a onClick={() => setShouldClearFilters(true)} className="sm-font">
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
