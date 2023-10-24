import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { DoctorLocation, getDoctorLocationDistance } from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import { DistanceUnit } from "../../utils/DistanceUnit";
import Icon from "../../utils/Icon";

interface DoctorDistanceProps {
    doctorLocation: DoctorLocation | null | undefined;
    locationForDistanceCalculation?: Location;
    distanceUnit?: DistanceUnit;
}

function DoctorDistance({
    doctorLocation: doctorLocation,
    locationForDistanceCalculation,
    distanceUnit,
}: DoctorDistanceProps) {
    const distance =
        locationForDistanceCalculation &&
        doctorLocation &&
        getDoctorLocationDistance(doctorLocation, locationForDistanceCalculation, distanceUnit);

    const tooltipMessage = doctorLocation?.address ? <></> : <Tooltip>No link to address</Tooltip>;

    return (
        <>
            {distance && distance !== Infinity && (
                <OverlayTrigger placement="bottom" overlay={tooltipMessage}>
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
                    >
                        <p className="med-grey">
                            {distance.toFixed(1)} {distanceUnit}{" "}
                            <Icon icon="fas fa-location-arrow" solid={false} padding={false} />
                        </p>
                    </a>
                </OverlayTrigger>
            )}
        </>
    );
}

export default DoctorDistance;
