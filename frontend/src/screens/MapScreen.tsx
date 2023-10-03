import { ReactNode, useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

import { Doctor, DoctorLocation, doctorDistanceFromLocation } from "../types/doctors/doctor";
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
import GoogleMap, { Marker } from "../components/map/GoogleMap";
import useGoogleMaps, { Location } from "../utils/googleMaps/useGoogleMaps";
import AddressInputFormField from "../components/utils/form/addressField";
import ComboboxFormField from "../components/utils/form/comboboxField";
import Message from "../components/utils/Message";
import Button from "../components/utils/Button";
import getMarkerIcon from "../components/map/markerIcon";

function MapScreen() {
    const { setCurrentLocation, getAddress, getLocation, getDistance, isLoaded: isGoogleMapsLoaded } = useGoogleMaps();

    const { data: doctors, isListLoading, isListError, listError } = useDoctors();
    const { data: categories } = useDoctorCategories();
    const { data: specialities } = useDoctorSpecialities();

    const [matchedDoctorsIgnoringDistance, setMatchedDoctorsIgnoringDistance] = useState<Doctor[]>([]);
    const [matchedDoctorsIncludingDistance, setMatchedDoctorsIncludingDistance] = useState<Doctor[]>([]);
    const [doctorsInPage, setDoctorsInPage] = useState<Doctor[]>([]);
    const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
    const [currentDoctorLocation, setCurrentDoctorLocation] = useState<DoctorLocation | null>(null);
    const [markers, setMarkers] = useState<Marker[]>([]);

    const [location, setLocation] = useState<Location | undefined>();
    const [address, setAddress] = useState("");
    const [distance, setDistance] = useState<number | undefined>(100);
    const distanceUnit = location?.country === "US" ? "Mile" : "KM";

    const [nameIncludes, setNameIncluds] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
    const [specialitiesFilter, setSpecialitiesFilter] = useState<string[]>([]);

    const [sortKey, setSortKey] = useState<string>("Name");
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10); // TODO: initial value according to the view, i.e. how many doctors fit in?

    const addAdoctorLink = (reactNode: ReactNode) => (
        <a href="https://urlzs.com/bVdAh" target="_blank" rel="noreferrer">
            {reactNode}
        </a>
    );

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
                if (location === undefined) {
                    return 0;
                } else {
                    const distanceA = doctorDistanceFromLocation(a, location, distanceUnit);
                    const distanceB = doctorDistanceFromLocation(b, location, distanceUnit);
                    return distanceA < distanceB ? -1 : distanceB < distanceA ? 1 : 0;
                }
            },
        ],
    ]);

    const useCurrenetLocation = () => {
        setCurrentLocation((location: Location) => {
            setLocation(location);
            getAddress(location).then((address) => {
                if (address !== undefined) {
                    setAddress(address);
                }
            });
        });
    };

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
                    distance === undefined || location === undefined
                        ? undefined
                        : doctorDistanceFromLocation(doctor, location, distanceUnit);
                return (
                    distance === undefined || location === undefined || (doctorDistance && doctorDistance <= distance)
                );
            })
            .sort(sortOptions.get(sortKey));

        setMatchedDoctorsIncludingDistance(newMatchedDoctorsIncludingDistance);
        setMatchedDoctorsIncludingDistance([
            ...newMatchedDoctorsIncludingDistance,
            ...newMatchedDoctorsIncludingDistance,
            ...newMatchedDoctorsIncludingDistance,
        ]);
    }, [doctors, location, distance, nameIncludes, categoryFilter, specialitiesFilter, sortKey]);

    useEffect(() => {
        const matchedDoctorsMarkers: Marker[] = [];
        for (const doctor of matchedDoctorsIgnoringDistance) {
            for (const doctorLocationObj of doctor.locations) {
                if (
                    doctorLocationObj.lat !== undefined &&
                    doctorLocationObj.lat !== null &&
                    doctorLocationObj.lng !== undefined &&
                    doctorLocationObj.lng !== null
                ) {
                    const doctorLocation: Location = {
                        lat: Number(doctorLocationObj.lat!),
                        lng: Number(doctorLocationObj.lng!),
                    };

                    matchedDoctorsMarkers.push({
                        title: doctor.fullName,
                        location: doctorLocation,
                        inBounds:
                            distance === undefined ||
                            location === undefined ||
                            getDistance(location, doctorLocation) <= distance,
                        icon: getMarkerIcon(
                            doctor,
                            doctor === currentDoctor,
                            doctorLocationObj === currentDoctorLocation
                        ),
                        onClick: () => {
                            setCurrentDoctor(doctor);
                        },
                    });
                }
            }
            setMarkers(matchedDoctorsMarkers);
        }
    }, [matchedDoctorsIgnoringDistance, currentDoctor, currentDoctorLocation]);

    useEffect(() => {
        setDoctorsInPage(() => matchedDoctorsIncludingDistance.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize));
    }, [matchedDoctorsIncludingDistance, pageIndex, pageSize]);

    useEffect(() => {
        setCurrentDoctorLocation(
            currentDoctor?.locations !== undefined && currentDoctor.locations.length > 0
                ? currentDoctor?.locations[0]
                : null
        );
    }, [currentDoctor]);

    return (
        <LoadingWrapper isLoading={isListLoading} isError={isListError} error={listError as ResponseError}>
            <Container fluid>
                <Row>
                    <Col>
                        {currentDoctor !== null && (
                            <DoctorBigCard
                                doctor={currentDoctor}
                                show={currentDoctor !== null}
                                onClose={() => {
                                    setCurrentDoctor(null);
                                }}
                            />
                        )}
                        <Row className="p-2 m-2">
                            <Form>
                                <Form.Group as={Row}>
                                    <Form.Label column htmlFor="address">
                                        Address
                                    </Form.Label>
                                    <Col sm={7}>
                                        <AddressInputFormField<undefined>
                                            field={{
                                                type: "address",
                                                label: "address",
                                                getter: () => {
                                                    return address;
                                                },
                                                setter: (_: undefined, newAddress: string) => {
                                                    setAddress(newAddress);
                                                    getLocation(newAddress).then((location) => setLocation(location));
                                                    return undefined;
                                                },
                                            }}
                                            object={undefined}
                                        />
                                    </Col>
                                    <Col sm={2}>
                                        <a href="#" onClick={useCurrenetLocation}>
                                            use current location
                                        </a>
                                    </Col>
                                </Form.Group>
                                {location && (
                                    <Form.Group as={Row}>
                                        <Form.Label column htmlFor="distance">
                                            Distance
                                        </Form.Label>
                                        <Col sm={7}>
                                            <Form.Control
                                                type="number"
                                                id="distance"
                                                value={distance}
                                                onChange={(e) =>
                                                    setDistance(e.target.value ? Number(e.target.value) : undefined)
                                                }
                                            />
                                        </Col>
                                        <Col sm={2}>{distanceUnit}</Col>
                                    </Form.Group>
                                )}
                                <Form.Group as={Row}>
                                    <Form.Label column htmlFor="name">
                                        Name
                                    </Form.Label>
                                    <Col sm={9}>
                                        <Form.Control
                                            type="text"
                                            id="name"
                                            value={nameIncludes}
                                            onChange={(e) => setNameIncluds(e.target.value)}
                                            autoComplete="off"
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
                                                setter: (_, newCategory: string | undefined) =>
                                                    setCategoryFilter(newCategory) as undefined,
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
                        {matchedDoctorsIncludingDistance.length > 0 ? (
                            <>
                                <Row className="p-2 m-2">
                                    <Container className="doctorSearchResult">
                                        {doctorsInPage.map((doctor: Doctor) => (
                                            <DoctorSmallCard
                                                key={doctor.id}
                                                doctor={doctor}
                                                locationForDistanceCalculation={location}
                                                distanceUnit={distanceUnit}
                                                onClick={() => {
                                                    setCurrentDoctor(doctor);
                                                }}
                                            />
                                        ))}
                                    </Container>
                                </Row>
                                <Row className="p-2 m-2">
                                    <Pagination
                                        rowsCount={matchedDoctorsIncludingDistance.length}
                                        pageIndex={pageIndex}
                                        pageSize={pageSize}
                                        setPageIndex={setPageIndex}
                                        // setPageSize={setPageSize}
                                    />
                                </Row>
                            </>
                        ) : (
                            <>
                                <Message variant="warning">
                                    No doctors were found. If you know such doctor, please&nbsp;
                                    {addAdoctorLink(<>let us know</>)}
                                </Message>
                            </>
                        )}
                    </Col>
                    <Col className="p-2 m-2">
                        <Container className="map">
                            <GoogleMap center={location} markers={markers} />
                            <div className="aboveMap">
                                {addAdoctorLink(<Button variant="success" label="Recommend a doctor"></Button>)}
                            </div>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </LoadingWrapper>
    );
}

export default MapScreen;
