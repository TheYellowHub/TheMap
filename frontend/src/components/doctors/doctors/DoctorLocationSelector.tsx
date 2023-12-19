import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import { Doctor, DoctorLocation, getDoctorNearestLocation } from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import { DistanceUnit } from "../../utils/DistanceUnit";
import DoctorLocationAddress from "./DoctorLocationAddress";
import Button from "../../utils/Button";

interface DoctorLocationSelectorProps {
    doctor: Doctor;
    selectedLocation: DoctorLocation | undefined;
    setSelectedLocation: (doctorLocation: DoctorLocation) => void;
    locationForDistanceCalculation?: Location;
    distanceUnit?: DistanceUnit;
}

function DoctorLocationSelector({ doctor, selectedLocation, setSelectedLocation, locationForDistanceCalculation, distanceUnit = "mi" }: DoctorLocationSelectorProps) {
    useEffect(() => {
        const closestLocation =
            locationForDistanceCalculation && getDoctorNearestLocation(doctor, locationForDistanceCalculation);
        setSelectedLocation(closestLocation || doctor.locations[0]);
    }, [doctor]);

    return (
        <Container className="p-0 m-0">
            <Row className="w-100 m-0 gap-0 py-1 doctor-location">
                {doctor.locations.map((location, index) => (
                    <Button
                        label=""
                        className={`${location === selectedLocation ? "doctorLocationBtnSelected" : "doctorLocationBtn"}`}
                        icon={location === selectedLocation ? "fa-hospital" : ""}
                        key={`${location?.hospitalName || location?.address}-btn`}
                        onClick={() => setSelectedLocation && setSelectedLocation(location)}
                    >
                        <div className="one-line-text">{location?.hospitalName || `Office ${index + 1}`}</div>
                        {location.privateOnly && (
                            <p className="doctorLocationPrivateLabel p-0 m-0">
                                {location === selectedLocation ? "private" : "p"}
                            </p>
                        )}
                    </Button>
                ))}
            </Row>
        </Container>
    );
}

export default DoctorLocationSelector;
