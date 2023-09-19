import { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

import useDoctors from "../hooks/doctors/useDoctors";
import { Doctor } from "../types/doctors/doctor";
import DoctorSmallCard from "../components/doctors/doctors/DoctorSmallCard";
import DoctorBigCard from "../components/doctors/doctors/DoctorBigCard";
import LoadingWrapper from "../components/utils/LoadingWrapper";
import { ResponseError } from "../utils/request";

function MapScreen() {
    const { data: doctors, isListLoading, isListError, listError } = useDoctors();

    const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);

    const [nameIncludes, setNameIncluds] = useState("");

    const matchedDoctors: Doctor[] = doctors.filter(
        (doctor: Doctor) => doctor.fullName?.toLowerCase().includes(nameIncludes.toLowerCase())
    );

    return (
        <LoadingWrapper isLoading={isListLoading} isError={isListError} error={listError as ResponseError}>
            <Container fluid>
                <Row>
                    <Col>
                        <Row>
                            <Form>
                                <Form.Control
                                    type="text"
                                    placeholder="Doctor name"
                                    onChange={(e) => setNameIncluds(e.target.value)}
                                ></Form.Control>
                                {/* TODO: additional filters - categories, specialities */}
                            </Form>
                        </Row>
                        <Row>
                            {/* TODO: pagination, sort, ... */}
                            <Container className="doctorSearchResult">
                                {matchedDoctors.map((doctor: Doctor) => (
                                    <DoctorSmallCard
                                        key={doctor.id}
                                        doctor={doctor}
                                        onClick={() => setCurrentDoctor(doctor)}
                                    />
                                ))}
                            </Container>
                        </Row>
                    </Col>
                    <Col>
                        <Container className="map">Google map will be shown here</Container>
                    </Col>
                </Row>
            </Container>

            {currentDoctor !== null && (
                <DoctorBigCard
                    doctor={currentDoctor}
                    show={currentDoctor !== null}
                    onClose={() => setCurrentDoctor(null)}
                />
            )}
        </LoadingWrapper>
    );
}

export default MapScreen;
