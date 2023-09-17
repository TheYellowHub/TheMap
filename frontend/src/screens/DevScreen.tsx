import { Col, Container, Row } from "react-bootstrap";
import useDoctors from "../hooks/doctors/useDoctors";
import DoctorBigCard from "../components/doctors/doctors/DoctorBigCard";

// TODO: delete

function DevScreen() {
    const { data: doctors } = useDoctors();

    const doctor = doctors?.[0];

    return <DoctorBigCard doctor={doctor} showCard={true} />;
}

export default DevScreen;
