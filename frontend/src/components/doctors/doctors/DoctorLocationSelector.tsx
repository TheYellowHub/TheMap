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
        <Row className={`p-0 m-0 gap-0 py-1 doctor-location ${className}`}>
            {doctor.locations.map((location, index) => {
                const isSameLocation = currentDoctorLocation && sameLocation(location, currentDoctorLocation);
                return (<Button
                    label=""
                    className={`${isSameLocation ? "doctor-location-btn-selected" : "doctor-location-btn"}`}
                    key={`${location?.hospitalName || location?.longAddress}-btn`}
                    onClick={isSameLocation
                        ? undefined 
                        : () => setCurrentDoctorLocation(location)
                    }
                >
                    <div className={`one-line-text xs-font med${isSameLocation ? "-dark" : ""}-grey`}>{location?.hospitalName || `Office ${index + 1}`}</div>
                    {location.privateOnly && (
                        <p className="doctor-location-private-label xs-font p-0 m-0">
                            {currentDoctorLocation && sameLocation(location, currentDoctorLocation) ? "private" : "p"}
                        </p>
                    )}
                </Button>)
            })}
        </Row>
    );
}

export default DoctorLocationSelector;
