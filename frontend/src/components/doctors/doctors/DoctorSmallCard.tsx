import {
    Doctor,
    doctorDistanceFromLocation,
} from "../../../types/doctors/doctor";
import StarRating from "./StarRating";
import { DistanceUnit } from "../../utils/DistanceUnit";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";

import { Tooltip, OverlayTrigger } from "react-bootstrap";

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
        doctorDistanceFromLocation(
            doctor,
            locationForDistanceCalculation,
            distanceUnit
        );

    const image = doctor.image
        ? doctor.image.toString()
        : doctor.gender === "F"
        ? "images/default-doctor-f.png"
        : "images/default-doctor-m.png";

    const address = doctor.locations[0]
        ? doctor.locations[0].address || "no address"
        : "no location";
    // TODO: replace with the real fields
    const averageRating = 4.5;
    const totalReviews = 10;

    return (
        <div className="doctorSmallCard" onClick={onClick}>
            <img
                style={{
                    width: "7.125rem",
                    height: "8.875rem",
                    borderRadius: "0.25rem 0 0 0.25rem",
                }}
                src={image}
                alt={doctor.fullName}
            />
            <div className="doctorSmallCardData">
                <div>
                    <h5>{doctor.fullName}</h5>
                </div>
                <div className="row w-100 m-0">
                    <div className="bookmarkRibbon col-auto">
                        <p className="text-black">
                            {doctor.category || "No Category"}
                        </p>
                    </div>
                    <div className="col">
                        <span className="verification">
                            {doctor.nancysNook && (
                                <img
                                    className="px-1"
                                    src="images/nancynook.png"
                                    alt="nancy nook"
                                />
                            )}
                            {doctor.iCareBetter && (
                                <OverlayTrigger
                                    placement="bottom"
                                    overlay={<Tooltip>View Profile</Tooltip>}
                                >
                                    <a href={doctor.iCareBetter}>
                                        <img
                                            className="px-1"
                                            src="images/icarebetter.png"
                                            alt="iCareBetter"
                                        />
                                    </a>
                                </OverlayTrigger>
                            )}
                        </span>
                    </div>
                </div>
                <div className="row w-100 m-0">
                    <div className="col ps-0">
                        <p>{address}</p>
                    </div>
                    <div className="col-auto pe-0" style={{ color: "#989898" }}>
                        {distance && distance !== Infinity && (
                            <p>
                                {distance.toFixed(1)} {distanceUnit}{" "}
                                <i className="fas fa-location-arrow"></i>
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
