import {
    Doctor,
    doctorDistanceFromLocation,
} from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import { DistanceUnit } from "../../utils/DistanceUnit";
import StarRating from "./StarRating";

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
    const distance = 10;
    // locationForDistanceCalculation &&
    // doctorDistanceFromLocation(
    //     doctor,
    //     locationForDistanceCalculation,
    //     distanceUnit
    // );

    const image = doctor.image
        ? doctor.image.toString()
        : doctor.gender === "F"
        ? "images/default-doctor-f.png"
        : "images/default-doctor-m.png";

    const address = doctor.locations[0]
        ? doctor.locations[0].address
            ? doctor.locations[0].address
            : "no address"
        : "no location";
    // TODO: replace with the real fields
    const averageRating = 4.5;
    const totalReviews = 10;
    return (
        <div className="doctorSmallCard" onClick={onClick}>
            <img
                style={{ width: "7.125rem", height: "8.875rem" }}
                src={image}
                alt={doctor.fullName}
            />
            <div className="doctorSmallCardData">
                <div>
                    <h5>{doctor.fullName} </h5>
                </div>
                <div>
                    <div className="ms-1 position-absolute text-black">
                        {doctor.specialities[0]}
                    </div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="141"
                        height="21"
                        viewBox="0 0 141 21"
                        fill="none"
                    >
                        <path
                            d="M140.921 0H0.920898V21H140.921L129.029 10.7333L140.921 0Z"
                            fill="#F2C94C"
                        />
                    </svg>
                </div>
                <div className="row w-100 m-0">
                    <div className="col ps-0">
                        <p>{address}</p>
                    </div>
                    <div className="col-auto pe-0" style={{ color: "#989898" }}>
                        {distance && distance !== Infinity && (
                            <p>
                                {distance.toFixed(2)} {distanceUnit}
                            </p>
                        )}
                    </div>
                </div>
                <div className="text-black row w-100 m-0 mt-auto">
                    <div className="col ps-0 text-nowrap">
                        <p style={{ color: "#333" }}>
                            {StarRating({ rating: averageRating })}{" "}
                            {averageRating}
                        </p>
                    </div>
                    <div className="col-auto pe-0">
                        <p>{totalReviews} Reviews</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorSmallCard;
