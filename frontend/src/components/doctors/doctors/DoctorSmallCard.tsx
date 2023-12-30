import { Col, Container, Row } from "react-bootstrap";

import { Doctor, getDoctorNearestLocation } from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import DoctorImage from "./DoctorImage";
import DoctorVerification from "./DoctorVerification";
import Rating from "../../utils/Rating";
import DoctorCategory from "./DoctorCategory";
import DoctorLocationAddress from "./DoctorLocationAddress";
import SaveDoctorIcon from "./SaveDoctorIcon";

interface DoctorSmallCardProps {
    doctor: Doctor;
    locationForDistanceCalculation?: Location;
    onClick: (() => void) | undefined;
}

export const doctorSmallCardClassName = "doctor-small-card";

export default function DoctorSmallCard({
    doctor,
    locationForDistanceCalculation,
    onClick,
}: DoctorSmallCardProps) {
    const closestLocation =
        locationForDistanceCalculation ? getDoctorNearestLocation(doctor, locationForDistanceCalculation) : (doctor.locations && doctor.locations[0]);

    return (
        <Container className={`${doctorSmallCardClassName} mx-0 px-0 ${onClick && "pointer"}`} onClick={onClick} fluid>
            <Row className="flex-nowrap p-0 m-0">
                <Col className="flex-grow-0 p-0 m-0">
                    <DoctorImage doctor={doctor} />
                </Col>
                <Col className="d-grid m-0 p-3 gap-2 align-content-between h-doctor-image">
                    <Row className="w-100 m-0 p-0 gap-2">
                        <Row className="w-100 m-0 p-0">
                            <Col className="px-0 font-assistant md-font w-700">{doctor.fullName}</Col>
                            <SaveDoctorIcon doctor={doctor} colClassName="flex-grow-0 p-0 m-0" />
                        </Row>
                        <Row className="w-100 m-0 p-0 gap-1">
                            <Col className="p-0 flex-grow-0">
                                <DoctorCategory category={doctor.category} />
                            </Col>
                            <Col className="m-0 p-0 flex-grow-0">
                                <DoctorVerification doctor={doctor} />
                            </Col>
                        </Row>
                    </Row>
                    <Row className="m-0 p-0 gap-2">
                        <Col className="m-0 p-0 d-flex flex-nowrap text-nowrap flex-grow-0">
                            {closestLocation && (
                                <DoctorLocationAddress
                                    doctorLocation={closestLocation}
                                    showDistanceAndNavigator={false}
                                    useShortAddress={true}
                                />
                            )}
                        </Col>
                        {1 < doctor.locations.length && <Col className="m-0 p-0 d-flex flex-nowrap circle bg-med-light-grey med-dark-grey xs-font px-1 flex-grow-0">
                            +{doctor.locations.length - 1}
                        </Col>}
                        <Col className="d-flex justify-content-end m-0 p-0">
                            {doctor.avgRating && doctor.numOfReviews && (
                                <Rating averageRating={doctor.avgRating} totalReviews={undefined} shorterFormat={true} />
                            )}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

