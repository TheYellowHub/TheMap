import { Col, Container, Row } from "react-bootstrap";

import { Doctor, getDoctorNearestLocation } from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import DoctorImage from "./DoctorImage";
import DoctorVerification from "./DoctorVerification";
import Rating from "../../utils/Rating";
import DoctorCategory from "./DoctorCategory";
import DoctorLocationAddress from "./DoctorLocationAddress";
import SaveDoctorIcon from "./SaveDoctorIcon";

interface DoctorTinyCardProps {
    doctor: Doctor;
    onClick: (() => void) | undefined;
}

export const doctorTinyCardClassName = "doctorTinyCard";

export default function DoctorTinyCard({
    doctor,
    onClick,
}: DoctorTinyCardProps) {
    return (
        <Container className={`${doctorTinyCardClassName} mx-0 px-0 ${onClick && "pointer"} w-fit-content`} onClick={onClick} fluid>
            <Row className="flex-nowrap">
                <Col className="flex-grow-0 pe-1">
                    <DoctorImage doctor={doctor} />
                </Col>
                <Col className="d-grid px-2 py-1 gap-2 align-content-between">
                    <Row className="w-100 m-0 pe-1">
                        <Col className="px-0 doctorSmallCardName font-assistant lg-font w-fit-content">{doctor.fullName}</Col>
                    </Row>
                    <Row className="w-100 m-0 gap-1">
                        <Col className="px-0 flex-grow-0">
                            <DoctorCategory category={doctor.category} />
                        </Col>
                        <Col className="px-0 flex-grow-0">
                            <DoctorVerification doctor={doctor} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

