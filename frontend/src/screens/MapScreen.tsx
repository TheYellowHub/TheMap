import { useEffect, useState } from "react";
import { Col, Container, Row, Modal as ReactModal } from "react-bootstrap";

import LoadingWrapper from "../components/utils/LoadingWrapper";
import { ResponseError } from "../hooks/useApiRequest";
import { Doctor, DoctorLocation, getDoctorNearestLocation } from "../types/doctors/doctor";
import useDoctors from "../hooks/doctors/useDoctors";
import DoctorSearchFilters from "../components/doctors/search/DoctorSearchFilters";
import DoctorSearchResults from "../components/doctors/search/DoctorSearchResults";
import DoctorSearchMap from "../components/doctors/search/DoctorSearchMap";
import Icon from "../components/utils/Icon";
import DoctorSearchNoResuls from "../components/doctors/search/DoctorSearchNoResults";
import MapLoadingError from "../components/map/MapLoadingError";
import useGoogleMaps, { Location } from "../utils/googleMaps/useGoogleMaps";
import DoctorSearchAddressFilter from "../components/doctors/search/DoctorSearchAddressFilter";
import { useParams } from "react-router-dom";

interface MapScreenProps {
    startWithMyList?: boolean;
}

function MapScreen({ startWithMyList = false }: MapScreenProps) {
    const { data: doctors, isListLoading, isListError, listError } = useDoctors();
    const { id: initialDoctorId } = useParams();
    const [initialDoctorIdParamWasUsed, setInitialDoctorIdParamWasUsed] = useState(false);

    const [matchedDoctorsIgnoringDistance, setMatchedDoctorsIgnoringDistance] = useState<Doctor[]>([]);
    const [matchedDoctorsIncludingDistance, setMatchedDoctorsIncludingDistance] = useState<Doctor[]>([]);
    const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
    const [currentDoctorLocation, setCurrentDoctorLocation] = useState<DoctorLocation | null>(null);

    const myListFilterName = "My list";
    const [listFilter, setListFilter] = useState<string | undefined>();

    const { setCurrentLocation, getAddress } = useGoogleMaps();
    const [address, setAddress] = useState<string | undefined>(undefined);
    const [addressLocation, setAddressLocation] = useState<Location | undefined>();
    const distanceDefault = 100;
    const [distance, setDistance] = useState<number | undefined>(distanceDefault);
    const distanceUnit = addressLocation?.country === "US" ? "mi" : "km";

    const [shouldClearFilters, setShouldClearFilters] = useState(false);
    const [shouldClearAddress, setShouldClearAddress] = useState(false);

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

    useEffect(() => setDistance(distanceDefault), [address]);

    useEffect(() => {
        if (shouldClearFilters) {
            setShouldClearFilters(false);
            setCurrentDoctor(null);
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
        if (currentDoctor === null) {
            setCurrentDoctorLocation(null);
        } else if (currentDoctorLocation === null) {
            if (addressLocation !== undefined) {
                setCurrentDoctorLocation(getDoctorNearestLocation(currentDoctor, addressLocation));
            } else if (currentDoctor.locations.length > 0) {
                setCurrentDoctorLocation(currentDoctor.locations[0]);
            }
        }
        currentDoctor && window.history.replaceState(null, "", `#/${currentDoctor?.id}`);
    }, [currentDoctor]);

    useEffect(() => {
        if (doctors && 0 < doctors.length) {
            if (initialDoctorId && !initialDoctorIdParamWasUsed) {
                const doctor = doctors.find((doctor: Doctor) => doctor.id === Number(initialDoctorId));
                if (doctor !== undefined) {
                    setCurrentDoctor(doctor);
                }
                setInitialDoctorIdParamWasUsed(true);
            } else if (currentDoctor) {
                setCurrentDoctor(null);
            }
        }
    }, [doctors, matchedDoctorsIncludingDistance, initialDoctorId]);

    return (
        <LoadingWrapper isLoading={isListLoading} isError={isListError} error={listError as ResponseError}>
            <Container fluid>
                <Row className="d-flex mt-2 mb-0 flex-md-nowrap">
                    <Col className="mx-3 px-3">
                        <Row className="px-2 pb-2 mb-2">
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
                            />

                            {address === undefined && currentDoctor === null && !startWithMyList && (
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

                        <Row className="d-flex py-2 my-2 gap-3">
                            <Col className="med-dark-grey fst-italic px-2">
                                {matchedDoctorsIncludingDistance.length} results
                                {address && distance && (
                                    <>
                                        &nbsp;for &quot;{address}&quot; within {distance} {distanceUnit}
                                    </>
                                )}
                            </Col>
                            <Col sm={4} className="d-flex justify-content-end text-nowrap" style={{ paddingRight: 12 }}>
                                {address && distance && (
                                    <a href="#" onClick={() => setDistance(distance + 20)}>
                                        <Icon icon="fa-location-crosshairs" />
                                        Search larger area
                                    </a>
                                )}
                            </Col>
                        </Row>

                        <Row className="py-2 my-2">
                            {currentDoctor !== null || matchedDoctorsIncludingDistance.length > 0 ? (
                                <DoctorSearchResults
                                    doctors={matchedDoctorsIncludingDistance}
                                    currentDoctor={currentDoctor}
                                    setCurrentDoctor={setCurrentDoctor}
                                    locationForDistanceCalculation={addressLocation}
                                    distanceUnit={distanceUnit}
                                />
                            ) : (
                                <DoctorSearchNoResuls
                                    address={address}
                                    distance={distance}
                                    setDistance={setDistance}
                                    setShouldClearFilters={setShouldClearFilters}
                                    myList={listFilter === myListFilterName}
                                />
                            )}
                        </Row>
                    </Col>

                    <Col className="mx-0 px-0" md={5}>
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

            <MapLoadingError />
        </LoadingWrapper>
    );
}

export default MapScreen;
