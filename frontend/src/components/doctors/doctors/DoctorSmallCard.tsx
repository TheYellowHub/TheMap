import {
  Doctor,
  doctorDistanceFromLocation,
} from "../../../types/doctors/doctor";
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
    distanceUnit = "Mile",
    onClick,
}: DoctorSmallCardProps) {
    const distance =
        locationForDistanceCalculation &&
        doctorDistanceFromLocation(doctor, locationForDistanceCalculation, distanceUnit);

    const image = doctor.image
        ? doctor.image.toString()
        : "images/default-doctor-f.png";
    const address = doctor.locations[0] ? doctor.locations[0].address ? doctor.locations[0].address : "no address" : "no location";
    // TODO: replace with the real fields
    const averageRating = 4.5;
    const totalReviews = 10;
    return (
        <div className="doctorSmallCard" onClick={onClick}>
            <img src={image} alt={doctor.fullName} />
            <div className="doctorSmallCardData">
                <div><h5>{doctor.fullName} </h5></div>
                <div> {doctor.category}</div>
                <div> {address}</div>
                <div>
                    {averageRating} {totalReviews}
                </div>
                {distance && distance !== Infinity && (
                <p>
                    Distance: {distance.toFixed(2)} {distanceUnit}
                </p>
            )}
            </div>
        </div>
    );
}

export default DoctorSmallCard;
