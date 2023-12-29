import { DoctorLocation, getDoctorLocationDistance } from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import { DistanceUnit } from "../../utils/DistanceUnit";
import Icon from "../../utils/Icon";
import Tooltip from "../../utils/Tooltip";

interface DoctorLocationDistanceProps {
    doctorLocation: DoctorLocation;
    locationForDistanceCalculation?: Location;
    distanceUnit?: DistanceUnit;
}

function DoctorLocationDistance({
    doctorLocation,
    locationForDistanceCalculation,
    distanceUnit
}: DoctorLocationDistanceProps) {
    const distance = locationForDistanceCalculation && getDoctorLocationDistance(doctorLocation, locationForDistanceCalculation, distanceUnit);

    return (
        <Tooltip text={`${doctorLocation.longAddress ? "Navigate" : "No address"}`}>
            <p className="med-grey p-0 m-0">
                    <a
                        href={`${
                            doctorLocation?.longAddress
                                ? `http://maps.google.com/maps/dir//${doctorLocation.longAddress}`
                                : "#"
                        }`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="a-only-hover-decoration"
                    >
                            {distance && distance !== Infinity && <>{distance.toFixed(1)} {distanceUnit}</>}
                            <Icon icon="fas fa-location-arrow ps-1" solid={false} />
                    </a>
            </p>
        </Tooltip>
    );
}

export default DoctorLocationDistance;
