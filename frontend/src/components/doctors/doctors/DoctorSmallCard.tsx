import {
    Doctor,
    getDoctorNearestLocation,
} from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import { DistanceUnit } from "../../utils/DistanceUnit";
import DoctorImage from "./DoctorImage";
import DoctorVerification from "./DoctorVerification";
import DoctorDistance from "./DoctorDistance";
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
    distanceUnit = "mi",
    onClick,
}: DoctorSmallCardProps) {
    const closestLocation =
        locationForDistanceCalculation &&
        getDoctorNearestLocation(doctor, locationForDistanceCalculation);

    // TODO: replace with the real fields
    const averageRating = 4.5;
    const totalReviews = 10;

    return (
        <div className="doctorSmallCard" onClick={onClick}>
            <DoctorImage doctor={doctor} />
            <div className="doctorSmallCardData">
                <div>
                    <h5 className="text-nowrap">{doctor.fullName}</h5>
                </div>
                <div className="row w-100 m-0 flex-nowrap">
                    <div className="doctorCategoryRibbon col-auto">
                        <p className="text-black">{doctor.category || ""}</p>
                    </div>
                    <div className="col">
                        <DoctorVerification doctor={doctor} />
                    </div>
                </div>
                <div className="row w-100 m-0 flex-nowrap">
                    <div className="col ps-0">
                        <p className="med-dark-grey doctorSmallCardDataAddress">
                            {closestLocation?.address || ""}
                        </p>
                    </div>
                    <div className="col-auto pe-0">
                        <DoctorDistance
                            location={closestLocation}
                            locationForDistanceCalculation={
                                locationForDistanceCalculation
                            }
                            distanceUnit={distanceUnit}
                        />
                    </div>
                </div>
                <div className="text-black row w-100 m-0 mt-auto flex-nowrap">
                    <div className="col ps-0 text-nowrap">
                        <p className="dark-grey">
                            {StarRating({ rating: averageRating })}{" "}
                            {averageRating}
                        </p>
                    </div>
                    <div className="col-auto pe-0">
                        <p className="dark-grey">{totalReviews} Reviews</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorSmallCard;
