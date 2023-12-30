import { Col, Container, Row } from "react-bootstrap";

import { DoctorLocation } from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import { DistanceUnit } from "../../utils/DistanceUnit";
import DoctorLocationAddress from "./DoctorLocationAddress";
import Button from "../../utils/Button";

interface DoctorLocationCardProps {
    doctorLocation: DoctorLocation;
    locationForDistanceCalculation?: Location;
    distanceUnit?: DistanceUnit;
}

function DoctorLocationCard({ doctorLocation, locationForDistanceCalculation, distanceUnit = "mi" }: DoctorLocationCardProps) {
    return (
        <Container className="p-0 m-0">
            <Row className="w-100 m-0 gap-3 py-1 doctor-location">
                {doctorLocation.privateOnly}
                <DoctorLocationAddress
                    doctorLocation={doctorLocation}
                    locationForDistanceCalculation={locationForDistanceCalculation}
                    distanceUnit={distanceUnit}
                    icon="fa-hospital"
                />
            </Row>
            <Row className="m-0 gap-3 py-1 doctor-location">
                {doctorLocation.website && (<Col className="px-0" xs="auto">
                    <Button
                        variant="primary"
                        icon="fa-globe"
                        iconClassName="ps-0 pe-3"
                        href={doctorLocation.website}
                        target="_blank"
                        label="Website"
                        className="w-max-content"
                    />
                </Col>)}
                {doctorLocation.phone && (<Col className="px-0" xs="auto">
                    <Button
                        variant="secondary"
                        icon="fa-phone"
                        iconClassName="ps-0 pe-3"
                        href={`tel:${doctorLocation.phone}`}
                        label={doctorLocation.phone}
                        className="w-max-content"
                    />
                </Col>)}
                {doctorLocation.email && (<Col className="px-0" xs="auto">
                    <Button
                        variant="secondary"
                        icon="fa-envelope"
                        iconClassName="ps-0 pe-3"
                        href={`mailto:${doctorLocation.email}`}
                        target="_blank"
                        label={doctorLocation.email}
                        className="w-max-content btn-no-colors"
                    />
                </Col>)}
            </Row>
        </Container>
    );
}

export default DoctorLocationCard;
