import { useEffect, useState } from "react";
import { Col, Container, Row, Modal as ReactModal } from "react-bootstrap";

import config from "../config.json";
import LoadingWrapper from "../components/utils/LoadingWrapper";
import { ResponseError } from "../hooks/useApiRequest";
import { Doctor, DoctorLocation, getDoctorNearestLocation } from "../types/doctors/doctor";
import useDoctors from "../hooks/doctors/useDoctors";
import DoctorSearchFilters from "../components/doctors/search/DoctorSearchFilters";
import DoctorSearchResults from "../components/doctors/search/DoctorSearchResults";
import DoctorSearchMap from "../components/doctors/search/DoctorSearchMap";
import DoctorSearchNoResuls from "../components/doctors/search/DoctorSearchNoResults";
import MapLoadingError from "../components/map/MapLoadingError";
import useGoogleMaps, { Location } from "../utils/googleMaps/useGoogleMaps";
import DoctorSearchAddressFilter from "../components/doctors/search/DoctorSearchAddressFilter";
import { useParams } from "react-router-dom";
import Button from "../components/utils/Button";
import BackButton from "../components/utils/BackButton";
import NoResults from "../components/doctors/search/NoResults";
import { logPageView } from "../utils/log";

interface MapScreenProps {
    onlyMyList?: boolean;
}

export const MAP_CONTAINER_ID = "map-container";

function MapScreen({ onlyMyList = false }: MapScreenProps) {
    const { data: doctors, isListLoading, isListError, listError } = useDoctors();
    const { id: doctorIdParam } = useParams();
    const [doctorIdParamWasUsed, setDoctorIdParamWasUsed] = useState(false);
    const [filterChangeSinceLastDoctorPick, setFilterChangeSinceLastDoctorPick] = useState(false);

    const [matchedDoctorsIgnoringDistance, setMatchedDoctorsIgnoringDistance] = useState<Doctor[]>([]);
    const [matchedDoctorsIncludingDistance, setMatchedDoctorsIncludingDistance] = useState<Doctor[]>([]);
    const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
    const [currentDoctorLocation, setCurrentDoctorLocation] = useState<DoctorLocation | null>(null);

    const { setCurrentLocation, getAddress } = useGoogleMaps();
    const [address, setAddress] = useState<string | undefined>(undefined);
    const [addressLocation, setAddressLocation] = useState<Location | undefined>();
    const distanceDefault = config.app.distanceDefault;
    const [distance, setDistance] = useState<number | undefined>(distanceDefault);
    const distanceUnit = addressLocation?.country === "US" ? "mi" : "km";

    const [shouldClearFilters, setShouldClearFilters] = useState(false);
    const [shouldClearAddress, setShouldClearAddress] = useState(false);

    const doctorsSearchResultsId = "doctor-search-results";
    const doctorsSearchColumnId = "doctors-search-column";
    const doctorsMapColumnId = "doctors-map-column";
    const [mapIsOpen, setMapIsOpen] = useState(false);

    const mapNode = (<DoctorSearchMap
        doctors={matchedDoctorsIgnoringDistance}
        centerLocation={addressLocation}
        boundsDistanceFromCenter={distance}
        currentDoctor={currentDoctor}
        setCurrentDoctor={setCurrentDoctor}
        currentDoctorLocation={currentDoctorLocation}
        setCurrentDoctorLocation={setCurrentDoctorLocation}
    />);

    const useCurrenetLocation = () => {
        setCurrentLocation((location) => {
            setAddressLocation(location);
            getAddress(location).then((address) => {
                if (address !== undefined) {
                    setAddress(address);
                }
            });
        });
    };

    const isMapBelowRsults = () => {
        const mapColumn = document.getElementById(doctorsMapColumnId);
        return mapColumn !== null && window.getComputedStyle(mapColumn, null).display.toLowerCase() === "none";
    };

    useEffect(() => {
        if (shouldClearFilters) {
            if (currentDoctor !== null) {
                setCurrentDoctor(null);
            }
        }
    }, [shouldClearFilters]);

    useEffect(() => {
        if (shouldClearAddress) {
            setAddress(undefined);
            setAddressLocation(undefined);
            setDistance(distanceDefault);
            setShouldClearAddress(false);
        }
    }, [shouldClearAddress]);

    useEffect(() => {
        if (filterChangeSinceLastDoctorPick && currentDoctor !== null) {
            setCurrentDoctor(null);
        }
    }, [filterChangeSinceLastDoctorPick]);

    useEffect(() => {
        setCurrentDoctor(null);
    }, [onlyMyList]);

    useEffect(() => {
        if (currentDoctor === null) {
            setCurrentDoctorLocation(null);
        } else if (currentDoctor !== null) {
            if (doctorIdParam && !doctorIdParamWasUsed) {
                setDoctorIdParamWasUsed(true);
            }
            setFilterChangeSinceLastDoctorPick(false);
            if (currentDoctorLocation === null) {
                if (addressLocation !== undefined) {
                    setCurrentDoctorLocation(getDoctorNearestLocation(currentDoctor, addressLocation));
                } else if (currentDoctor.locations.length > 0) {
                    setCurrentDoctorLocation(currentDoctor.locations[0]);
                }
            }
        }
        window.history.replaceState(null, "", currentDoctor ? `/${currentDoctor.id}/${currentDoctor.fullName.replaceAll(" ", "-")}/` : "/");
        logPageView();
    }, [currentDoctor]);

    useEffect(() => {
        if (doctorIdParam) {
            setDoctorIdParamWasUsed(false);
        }
    }, [doctorIdParam]);

    useEffect(() => {
        if (doctors && 0 < doctors.length) {
            if (doctorIdParam && !doctorIdParamWasUsed) {
                const doctor = doctors.find((doctor: Doctor) => doctor.id === Number(doctorIdParam));
                if (doctor !== undefined) {
                    setCurrentDoctor(doctor);
                } else if (currentDoctor !== null) {
                    setCurrentDoctor(null);
                }
            }
        }
    }, [doctors, matchedDoctorsIncludingDistance, doctorIdParam, doctorIdParamWasUsed]);

    useEffect(() => {
        if (0 < matchedDoctorsIncludingDistance.length && !mapIsOpen) {
            setMapIsOpen(true);
        }
    }, [matchedDoctorsIncludingDistance]);

    return (
        <LoadingWrapper isLoading={isListLoading} isError={isListError} error={listError as ResponseError} center={true}>
            <Container fluid>
                {onlyMyList && currentDoctor === null && <BackButton onClick={() => history.back()} className="only-mobile mx-0" />}
                <Row className="d-flex mt-2 mb-0 flex-md-nowrap gap-md-3">
                    {onlyMyList && matchedDoctorsIncludingDistance.length === 0 && <NoResults 
                        title="Saved providers"
                        icon="fa-user-doctor" 
                        subtitle="No Providers Saved"
                        message="Save providers to your account for easy access while evaluating your care team."
                        linkTitle="Find providers now"
                        linkTo="#"
                        className="m-3 w-50-desktop"
                    />}
                    
                    <Col className={`mx-3 px-3 ${onlyMyList && matchedDoctorsIncludingDistance.length === 0 ? "d-none" : ""}`} id={doctorsSearchColumnId}>
                        <Row className={`pb-2 mb-2 ${currentDoctor ? "only-desktop" : ""}`}>
                            <DoctorSearchFilters
                                address={address}
                                setAddress={setAddress}
                                addressLocation={addressLocation}
                                setAddressLocation={setAddressLocation}
                                useCurrenetLocation={useCurrenetLocation}
                                distance={distance}
                                setDistance={setDistance}
                                distanceUnit={distanceUnit}
                                onlyMyList={onlyMyList}
                                doctors={doctors}
                                setMatchedDoctorsIgnoringDistance={setMatchedDoctorsIgnoringDistance}
                                setMatchedDoctorsIncludingDistance={setMatchedDoctorsIncludingDistance}
                                shouldClearFilters={shouldClearFilters}
                                setShouldClearFilters={setShouldClearFilters}
                                shouldClearAddress={shouldClearAddress}
                                setShouldClearAddress={setShouldClearAddress}
                                setValueChange={setFilterChangeSinceLastDoctorPick}
                            />

                            {config.app.forceAddressInput && address === undefined && currentDoctor === null && !onlyMyList && (
                                <ReactModal
                                    className="transparent d-flex justify-content-center big-address-filter"
                                    show={true}
                                    backdrop="static"
                                    centered
                                >
                                    <DoctorSearchAddressFilter
                                        address={address}
                                        setAddress={setAddress}
                                        addressLocation={addressLocation}
                                        setAddressLocation={setAddressLocation}
                                        useCurrenetLocation={useCurrenetLocation}
                                    />
                                </ReactModal>
                            )}
                        </Row>

                        {!currentDoctor && !onlyMyList && <Row className="d-flex pb-2 mb-2 gap-3">
                            <Col className="p-0">
                                <div className="med-dark-grey sm-font fst-italic d-inline">
                                    {matchedDoctorsIncludingDistance.length} results
                                    {address && distance && (
                                        <>
                                            &nbsp;for &quot;{address}&quot; within {distance} {distanceUnit}
                                        </>
                                    )}
                                </div>
                                <div className="px-2 med-dark-grey sm-font text-decoration-underline d-inline">
                                    {address && distance && (
                                        <a onClick={() => setDistance(distance + config.app.distanceJumps)} className="a-only-hover-decoration">
                                            Search larger area
                                        </a>
                                    )}
                                </div>
                            </Col>
                        </Row>}

                        <Row className="py-md-2 my-md-2" id={doctorsSearchResultsId}>
                            {currentDoctor !== null || matchedDoctorsIncludingDistance.length > 0 ? (
                                <DoctorSearchResults
                                    doctors={matchedDoctorsIncludingDistance}
                                    currentDoctor={currentDoctor}
                                    setCurrentDoctor={setCurrentDoctor}
                                    currentDoctorLocation={currentDoctorLocation}
                                    setCurrentDoctorLocation={setCurrentDoctorLocation}
                                    locationForDistanceCalculation={addressLocation}
                                    distanceUnit={distanceUnit}
                                    isMapBelowRsults={isMapBelowRsults}
                                />
                            ) : (
                                <DoctorSearchNoResuls
                                    address={address}
                                    distance={distance}
                                    setDistance={setDistance}
                                    setShouldClearFilters={setShouldClearFilters}
                                    setShouldClearAddress={setShouldClearAddress}
                                />
                            )}
                        </Row>
                    </Col>

                    <Col className="mx-0 px-0 only-desktop doctors-map-next-to-results" id={doctorsMapColumnId}>
                        {mapNode}
                    </Col>
                </Row>

                {<Container className={`mx-0 px-0 only-mobile doctors-map-below-results`} fluid>
                    <Row className={`mx-0 px-0 ${currentDoctor === null ? "" : "d-none"}`}>
                        <Col className="mx-0 px-0 d-flex justify-content-end">
                            <Button onClick={() => setMapIsOpen(!mapIsOpen)} label={`${mapIsOpen ? "Hide" : "Show"} Map`} icon="fa-location-dot" className="btn-map" />
                        </Col>
                    </Row>
                    <Row id={MAP_CONTAINER_ID} className={`mx-0 px-0 ${mapIsOpen === true && currentDoctor === null ? "" : "d-none"}`}>
                        <Col className="mx-0 px-0">
                            {mapNode}
                        </Col>
                    </Row>
                </Container>}
            </Container>

            <MapLoadingError />
        </LoadingWrapper>
    );
}

export default MapScreen;
