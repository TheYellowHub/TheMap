import {
    DoctorLocation,
    getDoctorLocationDistance,
} from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import { DistanceUnit } from "../../utils/DistanceUnit";
import Icon from "../../utils/Icon";

interface DoctorDistanceProps {
    location: DoctorLocation | null | undefined;
    locationForDistanceCalculation?: Location;
    distanceUnit?: DistanceUnit;
}

function DoctorDistance({
    location,
    locationForDistanceCalculation,
    distanceUnit,
}: DoctorDistanceProps) {
    const distance =
        locationForDistanceCalculation &&
        location &&
        getDoctorLocationDistance(
            location,
            locationForDistanceCalculation,
            distanceUnit
        );

    return (
        <>
            {distance && distance !== Infinity && (
                <a
                    href={`http://maps.google.com/maps/dir/?api=1&dir_action=navigate&destination=${
                        location.address || ""
                    }`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                >
                    <p className="med-grey">
                        {distance.toFixed(1)} {distanceUnit}{" "}
                        <Icon
                            icon="fas fa-location-arrow"
                            solid={false}
                            padding={false}
                        />
                    </p>
                </a>
            )}
        </>
    );
}

export default DoctorDistance;
