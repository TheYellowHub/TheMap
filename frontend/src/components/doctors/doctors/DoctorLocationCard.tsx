import { Col, Container, Row } from "react-bootstrap";

import { DoctorLocation } from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import { DistanceUnit } from "../../utils/DistanceUnit";
import DoctorLocationAddress from "./DoctorLocationAddress";
import Button from "../../utils/Button";
import Line from "../../utils/Line";

interface DoctorLocationCardProps {
    doctorLocation: DoctorLocation;
    locationForDistanceCalculation?: Location;
    distanceUnit?: DistanceUnit;
}

function DoctorLocationCard({ doctorLocation, locationForDistanceCalculation, distanceUnit = "mi" }: DoctorLocationCardProps) {
    return (
        <Container className="d-flex flex-column p-0 m-0 doctor-location">
            <Row className="w-100 m-0 gap-3 py-1">
                {doctorLocation.privateOnly}
                <DoctorLocationAddress
                    doctorLocation={doctorLocation}
                    locationForDistanceCalculation={locationForDistanceCalculation}
                    distanceUnit={distanceUnit}
                    icon="fa-hospital fa-light"
                />
            </Row>
            {(doctorLocation.website || doctorLocation.phone || doctorLocation.email) && <Line />}
            <Row className="m-0 column-gap-5 py-1">
                {doctorLocation.website && (<Col className="px-0">
                    <Button
                        icon="fa-globe fa-regular"
                        iconClassName="ps-0 pe-3"
                        href={doctorLocation.website}
                        target="_blank"
                        label={doctorLocation.website}
                        className="w-max-content btn-no-colors a-only-hover-decoration doctor-location-contact"
                    />
                </Col>)}
                {doctorLocation.phone && (<Col className="px-0">
                    <Button
                        icon="fa-phone fa-regular"
                        iconClassName="ps-0 pe-3"
                        href={`tel:${doctorLocation.phone}`}
                        label={doctorLocation.phone}
                        className="w-max-content btn-no-colors a-only-hover-decoration doctor-location-contact"
                    />
                </Col>)}
                {doctorLocation.email && (<Col className="px-0">
                    <Button
                        icon="fa-envelope fa-regular"
                        iconClassName="ps-0 pe-3"
                        href={`mailto:${doctorLocation.email}`}
                        target="_blank"
                        label={doctorLocation.email}
                        className="w-max-content btn-no-colors a-only-hover-decoration doctor-location-contact"
                    />
                </Col>)}
            </Row>
        </Container>
    );
}

export default DoctorLocationCard;
