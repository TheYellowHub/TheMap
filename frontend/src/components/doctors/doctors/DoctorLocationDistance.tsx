import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { DoctorLocation, getDoctorLocationDistance } from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import { DistanceUnit } from "../../utils/DistanceUnit";
import Icon from "../../utils/Icon";

interface DoctorLocationDistanceProps {
    doctorLocation: DoctorLocation;
    locationForDistanceCalculation: Location;
    distanceUnit: DistanceUnit;
}

function DoctorLocationDistance({
    doctorLocation: doctorLocation,
    locationForDistanceCalculation,
    distanceUnit,
}: DoctorLocationDistanceProps) {
    const distance = getDoctorLocationDistance(doctorLocation, locationForDistanceCalculation, distanceUnit);

    const tooltipMessage = doctorLocation?.address ? <></> : <Tooltip>No link to address</Tooltip>;

    return (
        <>
            {distance && distance !== Infinity && (
                <OverlayTrigger placement="bottom" overlay={tooltipMessage}>
                    <p className="med-grey p-0 m-0">
                        <a
                            href={`${
                                doctorLocation?.address
                                    ? "http://maps.google.com/maps/dir/?api=1&dir_action=navigate&destination=" +
                                    doctorLocation.address
                                    : "#"
                            }`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="a-only-hover-decoration"
                        >
                                {distance.toFixed(1)} {distanceUnit}
                                <Icon icon="fas fa-location-arrow ps-1" solid={false} padding={false} />
                        </a>
                    </p>
                </OverlayTrigger>
            )}
        </>
    );
}

export default DoctorLocationDistance;
