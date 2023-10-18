import {
    Doctor,
    getDoctorNearestLocation,
} from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import { DistanceUnit } from "../../utils/DistanceUnit";
import DoctorImage from "./DoctorImage";
import DoctorVerification from "./DoctorVerification";
import DoctorDistance from "./DoctorDistance";
import Rating from "./Rating";
import DoctorCategory from "./DoctorCategory";

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
    const averageRating = 3.6;
    const totalReviews = 10;

    return (
        <div className="doctorSmallCard" onClick={onClick}>
            <div className="row flex-nowrap">
                <div className="col-auto">
                    <DoctorImage doctor={doctor} />
                </div>
                <div className="doctorSmallCardData col pe-3">
                    <div className="doctorSmallCardName mb-3">
                        {doctor.fullName}
                    </div>
                    <div className="row w-100 m-0 flex-nowrap">
                        <DoctorCategory category={doctor.category} />
                        <DoctorVerification doctor={doctor} />
                    </div>
                    <div
                        className="row w-100 m-0 flex-nowrap"
                        style={{ height: "50px" }}
                    >
                        <div className="col ps-0">
                            <p className="med-dark-grey doctorSmallCardDataAddress">
                                {closestLocation?.address || ""}
                            </p>
                        </div>
                        <div className="col-auto pe-0">
                            <DoctorDistance
                                doctorLocation={closestLocation}
                                locationForDistanceCalculation={
                                    locationForDistanceCalculation
                                }
                                distanceUnit={distanceUnit}
                            />
                        </div>
                    </div>
                    <Rating
                        averageRating={averageRating}
                        totalReviews={totalReviews}
                    />
                </div>
            </div>
        </div>
    );
}

export default DoctorSmallCard;
