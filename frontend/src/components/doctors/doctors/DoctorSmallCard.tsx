import { Doctor, getDoctorNearestLocation } from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import { DistanceUnit } from "../../utils/DistanceUnit";
import DoctorImage from "./DoctorImage";
import DoctorVerification from "./DoctorVerification";
import Rating from "./Rating";
import DoctorCategory from "./DoctorCategory";
import DoctorLocationAddress from "./DoctorLocationAddress";
import { Col, Container, Row } from "react-bootstrap";

interface DoctorSmallCardProps {
    doctor: Doctor;
    locationForDistanceCalculation?: Location;
    distanceUnit?: DistanceUnit;
    onClick: () => void;
}

export const doctorSmallCardClassName = "doctorSmallCard";

function DoctorSmallCard({
    doctor,
    locationForDistanceCalculation,
    distanceUnit = "mi",
    onClick,
}: DoctorSmallCardProps) {
    const closestLocation =
        locationForDistanceCalculation && getDoctorNearestLocation(doctor, locationForDistanceCalculation);

    // TODO: replace with the real fields
    const averageRating = undefined;
    const totalReviews = undefined;

    return (
        <Container className={`${doctorSmallCardClassName} mx-0 ps-0 pe-3`} onClick={onClick} fluid>
            <Row className="flex-nowrap">
                <Col className="flex-grow-0 pe-1">
                    <DoctorImage doctor={doctor} big={false} />
                </Col>
                <Col className="d-grid px-2 py-2 gap-2 align-content-between">
                    <Row className="w-100 m-0">
                        <Col className="px-0 doctorSmallCardName font-assistant lg-font">{doctor.fullName}</Col>
                    </Row>
                    <Row className="w-100 m-0 gap-1">
                        <Col className="px-0">
                            <DoctorCategory category={doctor.category} />
                        </Col>
                        <Col className="px-0" sm="auto">
                            <DoctorVerification doctor={doctor} />
                        </Col>
                    </Row>
                    <Row className="w-100 m-0">
                        {closestLocation && (
                            <DoctorLocationAddress
                                doctorLocation={closestLocation}
                                locationForDistanceCalculation={locationForDistanceCalculation}
                                distanceUnit={distanceUnit}
                            />
                        )}
                    </Row>
                    <Row className="w-100 m-0">
                        {averageRating && totalReviews && (
                            <Rating averageRating={averageRating} totalReviews={totalReviews} />
                        )}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default DoctorSmallCard;
