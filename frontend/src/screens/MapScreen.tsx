import { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import LoadingWrapper from "../components/utils/LoadingWrapper";
import { ResponseError } from "../utils/request";
import { Doctor, DoctorLocation, getDoctorNearestLocation } from "../types/doctors/doctor";
import { Location } from "../utils/googleMaps/useGoogleMaps";
import useDoctors from "../hooks/doctors/useDoctors";
import DoctorSearchFilters from "../components/doctors/search/DoctorSearchFilters";
import DoctorSearchResults from "../components/doctors/search/DoctorSearchResults";
import DoctorSearchMap from "../components/doctors/search/DoctorSearchMap";
import DoctorBigCard from "../components/doctors/doctors/DoctorBigCard";
import Icon from "../components/utils/Icon";
import { GoogleMapsLoaderContext } from "../utils/googleMaps/GoogleMapsLoader";
import Message from "../components/utils/Message";

function MapScreen() {
    const { data: doctors, isListLoading, isListError, listError } = useDoctors();
    const [matchedDoctorsIgnoringDistance, setMatchedDoctorsIgnoringDistance] = useState<Doctor[]>([]);
    const [matchedDoctorsIncludingDistance, setMatchedDoctorsIncludingDistance] = useState<Doctor[]>([]);
    const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
    const [currentDoctorLocation, setCurrentDoctorLocation] = useState<DoctorLocation | null>(null);

    const [address, setAddress] = useState<string | undefined>(undefined);
    const [addressLocation, setAddressLocation] = useState<Location | undefined>();
    const distanceDefault = 100;
    const [distance, setDistance] = useState<number | undefined>(distanceDefault);
    const distanceUnit = addressLocation?.country === "US" ? "mi" : "km";

    const [shouldClearFilters, setShouldClearFilters] = useState(false);

    const googleMapsIsLoaded = useContext(GoogleMapsLoaderContext);

    useEffect(() => {
        if (shouldClearFilters) {
            setAddress(undefined);
            setAddressLocation(undefined);
            setDistance(distanceDefault);
            setShouldClearFilters(false);
        }
    }, [shouldClearFilters]);

    useEffect(() => {
        if (currentDoctor === null) {
            setCurrentDoctorLocation(null);
        } else if (currentDoctorLocation === null) {
            if (addressLocation !== undefined) {
                setCurrentDoctorLocation(getDoctorNearestLocation(currentDoctor, addressLocation));
            } else if (currentDoctor.locations.length > 0) {
                setCurrentDoctorLocation(currentDoctor.locations[0]);
            }
        }
    }, [currentDoctor]);

    return (
        <LoadingWrapper isLoading={isListLoading} isError={isListError} error={listError as ResponseError}>
            <Container fluid>
                <Row className="d-flex">
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

                        <Row className="py-2 my-2">
                            <DoctorSearchFilters
                                address={address}
                                setAddress={setAddress}
                                addressLocation={addressLocation}
                                setAddressLocation={setAddressLocation}
                                distance={distance}
                                setDistance={setDistance}
                                distanceUnit={distanceUnit}
                                doctors={doctors}
                                setMatchedDoctorsIgnoringDistance={setMatchedDoctorsIgnoringDistance}
                                setMatchedDoctorsIncludingDistance={setMatchedDoctorsIncludingDistance}
                                shouldClearFilters={shouldClearFilters}
                                setShouldClearFilters={setShouldClearFilters}
                            />
                        </Row>

                        <Row className="py-2 my-2">
                            <Container className="d-flex gap-3">
                                <div className="notes">
                                    {matchedDoctorsIncludingDistance.length} results
                                    {address && distance && (
                                        <>
                                            &nbsp;for &quot;{address}&quot; within {distance} {distanceUnit}
                                        </>
                                    )}
                                </div>
                                <div className="col-md-auto">
                                    {address && distance && (
                                        <a href="#" onClick={() => setDistance(distance + 10)}>
                                            <Icon icon="fa-location-crosshairs" />
                                            Search larger area
                                        </a>
                                    )}
                                </div>
                            </Container>
                        </Row>

                        {!googleMapsIsLoaded && (
                            <Row className="py-2 my-2 d-flex justify-content-center">
                                <Message variant="danger">
                                    <div className="bold">
                                        The map couldn’t load
                                        <br />
                                        <a
                                            href="#"
                                            onClick={() => window.location.reload()}
                                            className="inheritTextStyle"
                                        >
                                            Reload to try again
                                        </a>
                                    </div>
                                </Message>
                            </Row>
                        )}

                        <Row className="py-2 my-2">
                            {matchedDoctorsIncludingDistance.length > 0 ? (
                                <DoctorSearchResults
                                    doctors={matchedDoctorsIncludingDistance}
                                    currentDoctor={currentDoctor}
                                    setCurrentDoctor={setCurrentDoctor}
                                    locationForDistanceCalculation={addressLocation}
                                    distanceUnit={distanceUnit}
                                />
                            ) : (
                                <Container fluid>
                                    <div className="bold">
                                        <br />
                                        No Results found
                                        <br />
                                        <br />
                                        <a
                                            href="#"
                                            onClick={() => setShouldClearFilters(true)}
                                            className="inheritTextStyle"
                                        >
                                            Clear filters
                                        </a>{" "}
                                        {/* TODO: clear filters */}
                                        {address && distance && (
                                            <>
                                                <br />
                                                or{" "}
                                                <a
                                                    href="#"
                                                    onClick={() => setDistance(distance + 10)}
                                                    className="inheritTextStyle"
                                                >
                                                    try a larger area
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </Container>
                            )}
                        </Row>
                    </Col>

                    <Col>
                        <DoctorSearchMap
                            doctors={matchedDoctorsIgnoringDistance}
                            centerLocation={addressLocation}
                            boundsDistanceFromCenter={distance}
                            currentDoctor={currentDoctor}
                            setCurrentDoctor={setCurrentDoctor}
                            currentDoctorLocation={currentDoctorLocation}
                            setCurrentDoctorLocation={setCurrentDoctorLocation}
                        />
                    </Col>
                </Row>
            </Container>
        </LoadingWrapper>
    );
}

export default MapScreen;
