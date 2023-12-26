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

export const doctorSmallCardClassName = "doctorSmallCard";

export default function DoctorSmallCard({
    doctor,
    locationForDistanceCalculation,
    onClick,
}: DoctorSmallCardProps) {
    const closestLocation =
        locationForDistanceCalculation ? getDoctorNearestLocation(doctor, locationForDistanceCalculation) : (doctor.locations && doctor.locations[0]);

    return (
        <Container className={`${doctorSmallCardClassName} mx-0 px-0 ${onClick && "pointer"}`} onClick={onClick} fluid>
            <Row className="flex-nowrap">
                <Col className="flex-grow-0 pe-1">
                    <DoctorImage doctor={doctor} />
                </Col>
                <Col className="d-grid px-2 py-2 gap-2 align-content-between">
                    <Row className="w-100 m-0 pe-1">
                        <Col className="px-0 doctorSmallCardName font-assistant lg-font">{doctor.fullName}</Col>
                        <SaveDoctorIcon doctor={doctor} colClassName="flex-grow-0" iconClassName="px-1" />
                    </Row>
                    <Row className="w-100 m-0 gap-1">
                        <Col className="px-0 flex-grow-0">
                            <DoctorCategory category={doctor.category} />
                        </Col>
                        <Col className="px-0 flex-grow-0">
                            <DoctorVerification doctor={doctor} />
                        </Col>
                    </Row>
                    <Row className="w-100 m-0">
                        {closestLocation && (
                            <DoctorLocationAddress
                                doctorLocation={closestLocation}
                                showDistanceAndNavigator={false}
                            />
                        )}
                    </Row>
                    <Row className="m-0">
                        {doctor.avgRating && doctor.numOfReviews && (
                            <Rating averageRating={doctor.avgRating} totalReviews={doctor.numOfReviews} shorterFormat={true} />
                        )}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

