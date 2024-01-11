import { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";

import config from "../../../config.json";
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
import Tooltip from "../../utils/Tooltip";

interface DoctorSearchFiltersProps {
    address: string | undefined;
    setAddress: (address: string) => void;
    addressLocation: Location | undefined;
    setAddressLocation: (addressLocation: Location | undefined) => void;
    useCurrenetLocation: () => void;
    distance: number | undefined;
    setDistance: (distance: number | undefined) => void;
    distanceUnit: DistanceUnit;
    onlyMyList: boolean;
    doctors: Doctor[];
    setMatchedDoctorsIgnoringDistance: (doctors: Doctor[]) => void;
    setMatchedDoctorsIncludingDistance: (doctors: Doctor[]) => void;
    shouldClearFilters: boolean;
    setShouldClearFilters: (shouldClearFilters: boolean) => void;
    shouldClearAddress: boolean;
    setShouldClearAddress: (shouldClearAddress: boolean) => void;
    setValueChange: (filterChange: boolean) => void;
    className?: string;
}

export default function DoctorSearchFilters({
    address,
    setAddress,
    addressLocation,
    setAddressLocation,
    useCurrenetLocation,
    distance,
    // eslint-disable-next-line
    setDistance,
    distanceUnit,
    doctors,
    onlyMyList,
    setMatchedDoctorsIgnoringDistance,
    setMatchedDoctorsIncludingDistance,
    shouldClearFilters,
    setShouldClearFilters,
    // eslint-disable-next-line
    shouldClearAddress,
    setShouldClearAddress,
    setValueChange,
    className
}: DoctorSearchFiltersProps) {
    const { data: categories } = useDoctorCategories();
    const { data: specialities } = useDoctorSpecialities();

    const { user } = useAuth();
    const { userInfo } = useUser(user);

    const formRef = useRef<HTMLFormElement>(null);

    const [nameFilter, setNameFilter] = useState<string>("");
    const [categoriesFilter, setCategoriesFilter] = useState<string[]>([]);
    const [specialitiesFilter, setSpecialitiesFilter] = useState<string[]>([]);
    const [listFilter, setListFilter] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(true);

    const distanceSortKey = "Closest first";
    const nameSortKey = "A - Z";
    const defaultSortKey = address ? distanceSortKey : nameSortKey;
    const [sortKey, setSortKey] = useState<string>(defaultSortKey);

    const listOptions: ReadonlyMap<string, (doctor: Doctor) => boolean> = new Map([
        ["icarebetter.com", (doctor: Doctor) => Boolean(doctor.iCareBetter)],        
        ["Nancy’s Nook", (doctor: Doctor) => doctor.nancysNook === true],
    ]);

    const filtered = (address !== undefined || 0 < categoriesFilter.length || 0 < specialitiesFilter.length || 0 < listFilter.length);
    const [ignoreNextDistanceChange, setIgnoreNextDistanceChange] = useState(false);

    const sortByName = (a: Doctor, b: Doctor) => {
        const nameA = getDoctorNameWithoutPrefix(a);
        const nameB = getDoctorNameWithoutPrefix(b);
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    };

    const sortOptions: ReadonlyMap<string, (a: Doctor, b: Doctor) => number> = new Map([
        [distanceSortKey, 
            (a, b) => {
                if (addressLocation === undefined) {
                    return 0;
                } else {
                    const distanceA = getDoctorMinimalDistance(a, addressLocation, distanceUnit);
                    const distanceB = getDoctorMinimalDistance(b, addressLocation, distanceUnit);
                    return distanceA < distanceB ? -1 : distanceB < distanceA ? 1 : 0;
                }
            }
        ],
        [nameSortKey, (a, b) => sortByName(a, b)],
        [nameSortKey.split("").reverse().join(""), (a, b) => -sortByName(a, b)],
    ]);

    const refilterDoctors = (filterDistance: number | undefined) => {
        
        const newMatchedDoctorsIgnoringDistance: Doctor[] = doctors.filter((doctor: Doctor) => 
                doctor.status === "APPROVED" &&
                (categoriesFilter.length === 0 || categoriesFilter.some((category) => category === doctor.category)) &&
                (specialitiesFilter.length === 0 || specialitiesFilter.some((speciality) => doctor.specialities.includes(speciality))) &&
                (listFilter.length === 0 || listFilter.some((listOption) => listOptions.get(listOption)!(doctor))) &&
                (!onlyMyList || userInfo?.savedDoctors?.includes(doctor.id!) === true) && 
                (doctor.fullName.toLowerCase().includes(nameFilter.toLowerCase()))
        );

        setMatchedDoctorsIgnoringDistance(newMatchedDoctorsIgnoringDistance);

        const newMatchedDoctorsIncludingDistance: Doctor[] = newMatchedDoctorsIgnoringDistance
            .filter((doctor: Doctor) => {
                const doctorDistance =
                    filterDistance === undefined || addressLocation === undefined
                        ? undefined
                        : getDoctorMinimalDistance(doctor, addressLocation, distanceUnit);
                return (
                    filterDistance === undefined ||
                    addressLocation === undefined ||
                    (doctorDistance && doctorDistance <= filterDistance)
                );
            })
            .sort(sortOptions.get(sortKey));

        setMatchedDoctorsIncludingDistance(newMatchedDoctorsIncludingDistance);
        return newMatchedDoctorsIncludingDistance;
    };

    useEffect(() => {
        setShowFilters(!onlyMyList);
        setShouldClearFilters(true);
        setShouldClearAddress(true);
    }, [onlyMyList]);

    useEffect(() => {
        refilterDoctors(distance);
    }, [doctors, nameFilter, categoriesFilter, specialitiesFilter, listFilter, sortKey, userInfo, onlyMyList]);

    useEffect(() => {
        if (ignoreNextDistanceChange) {
            setIgnoreNextDistanceChange(false);
        } else {
            refilterDoctors(distance);
        }
    }, [distance]);

    useEffect(() => {
        if (sortKey === distanceSortKey && addressLocation === undefined) {
            useCurrenetLocation();
        }
    }, [sortKey]);

    useEffect(() => {
        if (addressLocation !== undefined) {
            let filterDistance = config.app.distanceDefault;
            let matchedDoctors = refilterDoctors(filterDistance);
            while (matchedDoctors.length < config.app.minimumDoctorsInResults) {
                filterDistance += 10;
                matchedDoctors = refilterDoctors(filterDistance);
            }
            setIgnoreNextDistanceChange(true);
            setDistance(filterDistance);
            setSortKey(distanceSortKey);
        } else {
            setSortKey(nameSortKey);
        }
    }, [addressLocation]);

    useEffect(() => {
        if (shouldClearFilters) {
            formRef?.current?.reset();
            setNameFilter("");
            setCategoriesFilter([]);
            setSpecialitiesFilter([]);
            setListFilter([]);
            setShouldClearFilters(false);
        }
    }, [shouldClearFilters]);

    return (
        <Form ref={formRef} key={`filter-${onlyMyList ? "onlyMyList" : "all"}`} className={`px-0 mx-0 ${className}`}>
            <Container className={`d-grid gap-3`} fluid>
                {!onlyMyList && <Row className="d-flex">
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
                </Row>}
                {onlyMyList && <Row className="d-flex gap-3">
                    <Col className="px-0">
                        <Form.Control
                            type="text"
                            value={nameFilter}
                            onChange={(e) => {
                                setNameFilter(e.target.value);
                                setValueChange(true);
                            }}
                            // autoComplete="off"
                            placeholder="Search saved providers"
                            className="round-border grey-border"
                        />
                    </Col>
                    <Col className="d-flex justify-content-end align-items-center flex-grow-0 px-0">
                        <Icon icon="fa-filter" solid={showFilters} onClick={() => setShowFilters(!showFilters)} />
                    </Col>
                </Row>}
                {showFilters && (<Row className="d-flex gap-3 justify-content-between flex-lg-nowrap">
                    <Col xs={6} lg={3} className="px-0">
                        <Select
                            values={categories.filter((category) => 0 < doctors.filter((doctor) => doctor.category === category.name).length).map((category: DoctorCategory) => category.name)}
                            currentValue={categoriesFilter}
                            allowEmptySelection={true}
                            placeHolder="All Categories"
                            title="Categories"
                            onChange={(newValue: string[]) => {
                                setCategoriesFilter(newValue);
                                setValueChange(true);
                            }}
                            isMulti={true}
                        />
                    </Col>
                    <Col xs={5} lg={3} className="px-0">
                        <Tooltip text={"Many providers haven’t disclosed specialties yet"}>
                            <Select
                                values={specialities.filter((speciality) => 0 < doctors.filter((doctor) => doctor.specialities.includes(speciality.name)).length).map((speciality: DoctorSpeciality) => speciality.name)}
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
                        </Tooltip>
                    </Col>
                    <Col xs={6} lg={3} className="px-0">
                        <Select
                            values={Array.from(listOptions.keys())}
                            currentValue={listFilter}
                            allowEmptySelection={true}
                            placeHolder="All Lists"
                            title="Lists"
                            onChange={(newValue: string[]) => {
                                setListFilter(newValue);
                                setValueChange(true);
                            }}
                            isMulti={true}
                        />
                    </Col>
                    <Col xs={5} lg={2} className="d-flex align-items-center justify-content-between px-0">
                        <Col className="d-flex text-nowrap flex-grow-0">
                            {filtered && <a onClick={() => {
                                setShouldClearFilters(true);
                                setShouldClearAddress(true);
                            }} className="sm-font">
                                <Icon icon="fa-close" className="ps-0" />
                                Clear all
                            </a>}
                        </Col>
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
                    </Col>
                </Row>)}
            </Container>
        </Form>
    );
}
