import { Doctor } from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import { DistanceUnit } from "../../utils/DistanceUnit";
import DoctorImage from "./DoctorImage";
import DoctorVerification from "./DoctorVerification";
import Rating from "./Rating";
import DoctorCategory from "./DoctorCategory";
import DoctorAddress from "./DoctorAddress";

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
                    <div className="doctorSmallCardName mb-3">{doctor.fullName}</div>
                    <div className="row w-100 m-0 flex-nowrap">
                        <DoctorCategory category={doctor.category} />
                        <DoctorVerification doctor={doctor} />
                    </div>
                    <DoctorAddress
                        doctor={doctor}
                        locationForDistanceCalculation={locationForDistanceCalculation}
                        distanceUnit={distanceUnit}
                    />
                    <Rating averageRating={averageRating} totalReviews={totalReviews} />
                </div>
            </div>
        </div>
    );
}

export default DoctorSmallCard;
