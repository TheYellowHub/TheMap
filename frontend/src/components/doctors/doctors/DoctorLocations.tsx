import { useState } from "react";
import { Container, Row } from "react-bootstrap";

import { Doctor, getDoctorNearestLocation } from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import { DistanceUnit } from "../../utils/DistanceUnit";
import DoctorLocationAddress from "./DoctorLocationAddress";
import Button from "../../utils/Button";

interface DoctorLocationsProps {
    doctor: Doctor;
    locationForDistanceCalculation?: Location;
    distanceUnit?: DistanceUnit;
}

function DoctorLocations({ doctor, locationForDistanceCalculation, distanceUnit = "mi" }: DoctorLocationsProps) {
    const closestLocation =
        locationForDistanceCalculation && getDoctorNearestLocation(doctor, locationForDistanceCalculation);

    const [selectedLocation, setSelectedLocation] = useState(closestLocation || doctor.locations[0]);

    return (
        <Container className="p-0 m-0">
            <Row className="w-100 m-0 gap-0 py-1 doctor-location">
                {doctor.locations.map((location) => (
                    <Button
                        label={location?.hospitalName || ""}
                        className={location === selectedLocation ? "doctorLocationBtnSelected" : "doctorLocationBtn"}
                        icon={location === selectedLocation ? "fa-hospital" : ""}
                        key={`${location?.hospitalName || location?.address}-btn`}
                        onClick={() => setSelectedLocation && setSelectedLocation(location)}
                    >
                        {location.privateOnly && (
                            <p className="doctorLocationPrivateLabel p-0 m-0">
                                {location === selectedLocation ? "private" : "p"}
                            </p>
                        )}
                    </Button>
                ))}
            </Row>
            <Row className="w-100 m-0 gap-3 py-1 doctor-location">
                {selectedLocation?.privateOnly}
                <DoctorLocationAddress
                    doctorLocation={selectedLocation}
                    locationForDistanceCalculation={locationForDistanceCalculation}
                    distanceUnit={distanceUnit}
                />
                {selectedLocation?.website && (
                    <Button
                        variant="primary"
                        icon="fa-globe"
                        href={selectedLocation?.website}
                        target="_blank"
                        label={selectedLocation?.website}
                    />
                )}
                {selectedLocation?.email && (
                    <Button
                        variant="secondary"
                        icon="fa-envelope"
                        href={`emailto:${selectedLocation?.email}`}
                        target="_blank"
                        label={selectedLocation?.email}
                    />
                )}
                {selectedLocation?.phone && (
                    <Button
                        variant="secondary"
                        icon="fa-phone"
                        href={`tel:${selectedLocation?.phone}`}
                        label={selectedLocation?.phone}
                    />
                )}
            </Row>
        </Container>
    );
}

export default DoctorLocations;
