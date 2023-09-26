import { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { Autocomplete } from "@react-google-maps/api";

import { Doctor, newDoctor } from "../types/doctors/doctor";
import { DoctorCategory } from "../types/doctors/doctorCategory";
import { DoctorSpeciality } from "../types/doctors/DoctorSpeciality";
import useDoctors from "../hooks/doctors/useDoctors";
import useDoctorCategories from "../hooks/doctors/useDoctorCategories";
import useDoctorSpecialities from "../hooks/doctors/useDoctorSpecialities";
import DoctorSmallCard from "../components/doctors/doctors/DoctorSmallCard";
import DoctorBigCard from "../components/doctors/doctors/DoctorBigCard";
import CheckboxesGroupFormField from "../components/utils/form/checkboxesGroupField";
import Pagination from "../components/utils/Pagination";
import LoadingWrapper from "../components/utils/LoadingWrapper";
import { ResponseError } from "../utils/request";
import GoogleMap from "../components/map/GoogleMap";
import useGoogleMaps, { Location } from "../utils/googleMaps/useGoogleMaps";

function MapScreen() {
    const { setCurrentLocation, getAddress, getLocation } = useGoogleMaps();

    const { data: doctors, isListLoading, isListError, listError } = useDoctors();
    const { data: categories } = useDoctorCategories();
    const { data: specialities } = useDoctorSpecialities();

    const [matchedDoctors, setMatchedDoctors] = useState<Doctor[]>([]);
    const [doctorsInPage, setDoctorsInPage] = useState<Doctor[]>([]);
    const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);

    const [nameIncludes, setNameIncluds] = useState("");
    const [location, setLocation] = useState<Location | undefined>();
    const [address, setAddress] = useState("");
    const [distance, setDistance] = useState(50);
    const [distanceUnitsAsKm, setDistanceUnitsAsKm] = useState(false);
    const [categoriesFilter, setCategoriesFilter] = useState<string[]>([]);
    const [specialitiesFilter, setSpecialitiesFilter] = useState<string[]>([]);
    const [sortKey, setSortKey] = useState<string>("Name");
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10); // TODO: initial value according to the view, i.e. how many doctors fit in?

    const { isLoaded: googleMapsIsLoaded } = useGoogleMaps();

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
    ]);

    useEffect(() => {
        if (googleMapsIsLoaded) {
            setCurrentLocation((location: Location) => {
                setLocation(location);
                getAddress(location).then((address) => {
                    if (address !== undefined) {
                        setAddress(address);
                    }
                });
            });
        }
    }, [googleMapsIsLoaded]);

    useEffect(() => {
        // TODO: delete
        const manyDoctors: Doctor[] = [...doctors];
        for (let i = 0; i < 50; ++i) {
            manyDoctors.push({ ...newDoctor(), id: 100 - i, fullName: `Doctor ${i}` });
        }

        setMatchedDoctors(() =>
            manyDoctors
                .filter(
                    (doctor: Doctor) =>
                        doctor.fullName?.toLowerCase().includes(nameIncludes.toLowerCase()) &&
                        categoriesFilter.every((category) => doctor.categories.includes(category)) &&
                        specialitiesFilter.every((speciality) => doctor.specialities.includes(speciality))
                ) // TODO: filter by distance from location
                .sort(sortOptions.get(sortKey))
        );
    }, [doctors, nameIncludes, categoriesFilter, specialitiesFilter, sortKey]);

    useEffect(() => {
        setDoctorsInPage(() => matchedDoctors.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize));
    }, [matchedDoctors, pageIndex, pageSize]);

    return (
        <LoadingWrapper isLoading={isListLoading} isError={isListError} error={listError as ResponseError}>
            <Container fluid>
                <Row>
                    <Col>
                        <Row className="border p-2 m-2">
                            {/* // TODO: collapse? */}
                            <Form>
                                <Form.Group as={Row}>
                                    <Form.Label column htmlFor="address">
                                        Address
                                    </Form.Label>
                                    <Col sm={9}>
                                        <Autocomplete
                                            options={{
                                                types: ["geocode", "establishment"],
                                                fields: ["formatted_address"],
                                            }}
                                        >
                                            <Form.Control
                                                type="text"
                                                id="address"
                                                autoComplete="off"
                                                defaultValue={address}
                                                onBlur={(e) => {
                                                    const newAddress = e.target.value;
                                                    setAddress(newAddress);
                                                    getLocation(newAddress).then((location) => {
                                                        if (location !== undefined) {
                                                            setLocation(location);
                                                        }
                                                    });
                                                }}
                                            />
                                        </Autocomplete>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm={3} htmlFor="distance">
                                        Distance
                                    </Form.Label>
                                    <Col sm={5}>
                                        <Form.Control
                                            type="number"
                                            id="distance"
                                            value={distance}
                                            onChange={(e) => setDistance(Number(e.target.value))}
                                        />
                                    </Col>
                                    <Col sm={4}>
                                        <Form.Label column className="d-inline-block" htmlFor="distance-units">
                                            Mile
                                        </Form.Label>
                                        <Form.Check
                                            className="d-inline-block"
                                            type="switch"
                                            id="distance-units"
                                            checked={distanceUnitsAsKm}
                                            onChange={(e) => setDistanceUnitsAsKm(e.target.checked)}
                                        />
                                        <Form.Label column className="d-inline-block" htmlFor="distance-units">
                                            KM
                                        </Form.Label>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column htmlFor="name">
                                        Name
                                    </Form.Label>
                                    <Col sm={9}>
                                        <Form.Control
                                            type="text"
                                            id="name"
                                            autoComplete="off"
                                            value={nameIncludes}
                                            onChange={(e) => setNameIncluds(e.target.value)}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column>Categories</Form.Label>
                                    <Col sm={9}>
                                        <CheckboxesGroupFormField
                                            field={{
                                                type: "checkboxesGroup",
                                                label: "Categories",
                                                getter: () => categoriesFilter,
                                                setter: (_, newCategories: string[]) =>
                                                    setCategoriesFilter(newCategories) as undefined,
                                                options: categories.map((category: DoctorCategory) => {
                                                    return { key: category.name, value: category.name };
                                                }),
                                            }}
                                            object={undefined}
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
                                            value={sortKey}
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
                            </Form>
                        </Row>
                        <Row className="border p-2 m-2">
                            <Container className="doctorSearchResult">
                                {doctorsInPage.map((doctor: Doctor) => (
                                    <DoctorSmallCard
                                        key={doctor.id}
                                        doctor={doctor}
                                        onClick={() => {
                                            setCurrentDoctor(doctor);
                                            // TODO: something with the doctor marker/s on the map
                                        }}
                                    />
                                ))}
                            </Container>
                        </Row>
                        <Row className="border p-2 m-2">
                            <Pagination
                                rowsCount={matchedDoctors.length}
                                pageIndex={pageIndex}
                                pageSize={pageSize}
                                setPageIndex={setPageIndex}
                                setPageSize={setPageSize}
                            />
                        </Row>
                    </Col>
                    <Col className="border p-2 m-2">
                        <Container className="map">
                            {location && (
                                <GoogleMap
                                    center={location}
                                    markers={matchedDoctors.map((doctor) => {
                                        return {
                                            name: doctor.fullName,
                                            locations: doctor.locations.map((doctorLocation) => {
                                                return {
                                                    lat: location.lat + doctor.id!,
                                                    lng: location.lng + doctor.id!,
                                                }; // TODO: replace with the location lat/ lng
                                            }),
                                            onClick: () => setCurrentDoctor(doctor),
                                        };
                                    })}
                                />
                            )}
                        </Container>
                    </Col>
                </Row>
            </Container>

            {currentDoctor !== null && (
                <DoctorBigCard
                    doctor={currentDoctor}
                    show={currentDoctor !== null}
                    onClose={() => setCurrentDoctor(null)}
                />
            )}
        </LoadingWrapper>
    );
}

export default MapScreen;
