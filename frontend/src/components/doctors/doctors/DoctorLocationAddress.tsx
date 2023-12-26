import { Col, Row } from "react-bootstrap";
import { DoctorLocation } from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import { DistanceUnit } from "../../utils/DistanceUnit";
import DoctorLocationDistance from "./DoctorLocationDistance";

interface DoctorLocationAddressProps {
    doctorLocation: DoctorLocation;
    locationForDistanceCalculation?: Location;
    distanceUnit?: DistanceUnit;
    showDistanceAndNavigator?: boolean;
}

function DoctorLocationAddress({
    doctorLocation,
    locationForDistanceCalculation,
    distanceUnit,
    showDistanceAndNavigator = true
}: DoctorLocationAddressProps) {
    return (
        <Row className="d-flex p-0 m-0 gap-0 justify-content-between doctor-address">
            <Col className="p-0 pe-3">
                <p className="p-0 m-0 med-dark-grey sm-font">{doctorLocation?.address || ""}</p>
            </Col>
            <Col className="d-flex flex-grow-0 text-nowrap flex-nowrap p-0">
                {showDistanceAndNavigator && <DoctorLocationDistance
                    doctorLocation={doctorLocation}
                    locationForDistanceCalculation={locationForDistanceCalculation}
                    distanceUnit={distanceUnit}
                />}
            </Col>
        </Row>
    );
}

export default DoctorLocationAddress;
