import { Col, Container, OverlayTrigger, Row, Tooltip } from "react-bootstrap";

import { Doctor, getDoctorNearestLocation } from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import { DistanceUnit } from "../../utils/DistanceUnit";
import DoctorImage from "./DoctorImage";
import DoctorVerification from "./DoctorVerification";
import Rating from "../../utils/Rating";
import DoctorCategory from "./DoctorCategory";
import DoctorLocationAddress from "./DoctorLocationAddress";
import Icon from "../../utils/Icon";
import useAuth from "../../../auth/useAuth";
import useUser from "../../../hooks/auth/useUsers";
import SaveDoctorIcon from "./SaveDoctorIcon";

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
        locationForDistanceCalculation ? getDoctorNearestLocation(doctor, locationForDistanceCalculation) : (doctor.locations && doctor.locations[0]);

    const { user } = useAuth();
    const { userInfo } = useUser(user);

    return (
        <Container className={`${doctorSmallCardClassName} mx-0 px-0`} onClick={onClick} fluid>
            <Row className="flex-nowrap">
                <Col className="flex-grow-0 pe-1">
                    <DoctorImage doctor={doctor} big={false} />
                </Col>
                <Col className="d-grid px-2 py-2 gap-2 align-content-between">
                    <Row className="w-100 m-0">
                        <Col className="px-0 doctorSmallCardName font-assistant lg-font">{doctor.fullName}</Col>
                        <SaveDoctorIcon doctor={doctor} colClassName="ps-0 pe-3 flex-grow-0" iconClassName="px-1" />
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
                            />
                        )}
                    </Row>
                    <Row className="m-0">
                        {doctor.avgRating && doctor.numOfReviews && (
                            <Rating averageRating={doctor.avgRating} totalReviews={doctor.numOfReviews} />
                        )}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default DoctorSmallCard;
