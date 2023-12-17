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

interface MapScreenProps {
    startWithMyList?: boolean;
}

function MapScreen({ startWithMyList = false }: MapScreenProps) {
    const { data: doctors, isListLoading, isListError, listError } = useDoctors();
    const { id: doctorIdParam } = useParams();
    const [doctorIdParamWasUsed, setDoctorIdParamWasUsed] = useState(false);
    const [filterChangeSinceLastDoctorPick, setFilterChangeSinceLastDoctorPick] = useState(false);

    const [matchedDoctorsIgnoringDistance, setMatchedDoctorsIgnoringDistance] = useState<Doctor[]>([]);
    const [matchedDoctorsIncludingDistance, setMatchedDoctorsIncludingDistance] = useState<Doctor[]>([]);
    const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
    const [currentDoctorLocation, setCurrentDoctorLocation] = useState<DoctorLocation | null>(null);

    const myListFilterName = "My list";
    const [listFilter, setListFilter] = useState<string | undefined>();

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
    const [pagination, setPagination] = useState(true);
    const mapNode = (<DoctorSearchMap
        key={`DoctorSearchMap-Pagination:${pagination.toString()}`}
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

    const handleResize = () => {
        const mapColumn = document.getElementById(doctorsMapColumnId);
        const newPagination = mapColumn !== null && window.getComputedStyle(mapColumn, null).display.toLowerCase() !== "none";
        if (newPagination !== pagination) {
            setPagination(newPagination);
        }
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        handleResize();
    });

    useEffect(() => {
        if (shouldClearFilters) {
            setShouldClearFilters(false);
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
            // document.getElementById(doctorsSearchResultsId)?.scrollIntoView();
        }
        window.history.replaceState(null, "", `#/${currentDoctor?.id || ""}`);
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

    return (
        <LoadingWrapper isLoading={isListLoading} isError={isListError} error={listError as ResponseError}>
            <Container fluid>
                <Row className="d-flex mt-2 mb-0 flex-md-nowrap">
                    <Col className="mx-3 px-3" id={doctorsSearchColumnId}>
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
                                startWithMyList={startWithMyList}
                                myListFilterName={myListFilterName}
                                listFilter={listFilter}
                                setListFilter={setListFilter}
                                doctors={doctors}
                                setMatchedDoctorsIgnoringDistance={setMatchedDoctorsIgnoringDistance}
                                setMatchedDoctorsIncludingDistance={setMatchedDoctorsIncludingDistance}
                                shouldClearFilters={shouldClearFilters}
                                setShouldClearFilters={setShouldClearFilters}
                                shouldClearAddress={shouldClearAddress}
                                setShouldClearAddress={setShouldClearAddress}
                                setValueChange={setFilterChangeSinceLastDoctorPick}
                            />

                            {config.app.forceAddressInput && address === undefined && currentDoctor === null && !startWithMyList && (
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

                        {!currentDoctor && <Row className="d-flex py-2 my-2 gap-3">
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
                                    key={`DoctorSearchResults-Pagination:${pagination.toString()}`}
                                    doctors={matchedDoctorsIncludingDistance}
                                    currentDoctor={currentDoctor}
                                    setCurrentDoctor={setCurrentDoctor}
                                    locationForDistanceCalculation={addressLocation}
                                    distanceUnit={distanceUnit}
                                    pagination={pagination}
                                />
                            ) : (
                                <DoctorSearchNoResuls
                                    address={address}
                                    distance={distance}
                                    setDistance={setDistance}
                                    setShouldClearFilters={setShouldClearFilters}
                                    setShouldClearAddress={setShouldClearAddress}
                                    myList={listFilter === myListFilterName}
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
                    <Row className={`mx-0 px-0 ${mapIsOpen === true && currentDoctor === null ? "" : "d-none"}`}>
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
