import { useEffect } from "react";
import { Row } from "react-bootstrap";

import { Doctor, DoctorLocation, getDoctorNearestLocation, sameLocation } from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import Button from "../../utils/Button";

interface DoctorLocationSelectorProps {
    doctor: Doctor;
    currentDoctorLocation: DoctorLocation | null;
    setCurrentDoctorLocation: (currentDoctorLocation: DoctorLocation | null) => void;
    locationForDistanceCalculation?: Location;
    className?: string;
}

function DoctorLocationSelector({ doctor, currentDoctorLocation, setCurrentDoctorLocation, locationForDistanceCalculation, className }: DoctorLocationSelectorProps) {
    useEffect(() => {
        if (currentDoctorLocation === null) {
            const closestLocation = locationForDistanceCalculation && getDoctorNearestLocation(doctor, locationForDistanceCalculation);
            setCurrentDoctorLocation(closestLocation || doctor.locations[0]);
        }
    }, [doctor]);

    return (
        <Row className={`m-0 gap-0 py-1 doctor-location ${className}`}>
            {doctor.locations.map((location, index) => (
                <Button
                    label=""
                    className={`${currentDoctorLocation && sameLocation(location, currentDoctorLocation) && 1 < doctor.locations.length ? "doctorLocationBtnSelected" : "doctorLocationBtn"}`}
                    icon={location === currentDoctorLocation ? "fa-hospital" : ""}
                    key={`${location?.hospitalName || location?.address}-btn`}
                    onClick={(currentDoctorLocation && sameLocation(location, currentDoctorLocation))
                        ? undefined 
                        : () => setCurrentDoctorLocation(location)
                    }
                >
                    <div className="one-line-text">{location?.hospitalName || `Office ${index + 1}`}</div>
                    {location.privateOnly && (
                        <p className="doctorLocationPrivateLabel p-0 m-0">
                            {currentDoctorLocation && sameLocation(location, currentDoctorLocation) ? "private" : "p"}
                        </p>
                    )}
                </Button>
            ))}
        </Row>
    );
}

export default DoctorLocationSelector;
