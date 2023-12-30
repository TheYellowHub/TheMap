import { Col, Row } from "react-bootstrap";
import { DoctorLocation } from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import { DistanceUnit } from "../../utils/DistanceUnit";
import DoctorLocationDistance from "./DoctorLocationDistance";
import Icon from "../../utils/Icon";

interface DoctorLocationAddressProps {
    doctorLocation: DoctorLocation;
    locationForDistanceCalculation?: Location;
    distanceUnit?: DistanceUnit;
    showDistanceAndNavigator?: boolean;
    useShortAddress?: boolean;
    icon?: string;
}

function DoctorLocationAddress({
    doctorLocation,
    locationForDistanceCalculation,
    distanceUnit,
    showDistanceAndNavigator = true,
    useShortAddress = false,
    icon = "fa-location-dot"
}: DoctorLocationAddressProps) {
    return (
        <Row className={`d-flex p-0 m-0 gap-0 justify-content-between doctor-address ${useShortAddress && "one-line-text"}`}>
            <Col className="d-flex flex-nowrap align-content-middle p-0">
                <Icon icon={icon} className={`ps-0 ${useShortAddress ? "" : "pe-3"}`} />
                <p className="p-0 m-0 med-dark-grey sm-font">{(useShortAddress && doctorLocation.shortAddress) || doctorLocation.longAddress || ""}</p>
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
