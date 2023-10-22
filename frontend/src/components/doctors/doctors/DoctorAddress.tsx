import {
    Doctor,
    getDoctorNearestLocation,
} from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import { DistanceUnit } from "../../utils/DistanceUnit";
import DoctorDistance from "./DoctorDistance";

interface DoctorAddressProps {
    doctor: Doctor;
    locationForDistanceCalculation?: Location;
    distanceUnit?: DistanceUnit;
}

function DoctorAddress({
    doctor,
    locationForDistanceCalculation,
    distanceUnit,
}: DoctorAddressProps) {
    const closestLocation =
        locationForDistanceCalculation &&
        getDoctorNearestLocation(doctor, locationForDistanceCalculation);

    return (
        <div className="row w-100 m-0 flex-nowrap doctorSmallCardDataAddress">
            <div className="col ps-0">
                <p className="med-dark-grey doctorSmallCardDataAddressField">
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
    );
}

export default DoctorAddress;
