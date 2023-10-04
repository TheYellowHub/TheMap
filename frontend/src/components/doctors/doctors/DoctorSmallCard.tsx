import { Doctor, getDoctorMinimalDistance } from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import { DistanceUnit } from "../../utils/DistanceUnit";

interface DoctorSmallCardProps {
    doctor: Doctor;
    locationForDistanceCalculation?: Location;
    distanceUnit?: DistanceUnit;
    onClick: () => void;
}

function DoctorSmallCard({
    doctor,
    locationForDistanceCalculation,
    distanceUnit = "mi",
    onClick,
}: DoctorSmallCardProps) {
    const distance =
        locationForDistanceCalculation &&
        getDoctorMinimalDistance(doctor, locationForDistanceCalculation, distanceUnit);

    return (
        <div className="doctorSmallCard" onClick={onClick}>
            {doctor.fullName}
            <br />
            {doctor.category}
            <br />
            {doctor.specialities}
            <br />
            {distance && distance !== Infinity && (
                <p>
                    Distance: {distance.toFixed(2)} {distanceUnit}
                </p>
            )}
        </div>
    );
}

export default DoctorSmallCard;
