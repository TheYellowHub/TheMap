import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import { Doctor, DoctorLocation, getDoctorNearestLocation } from "../../../types/doctors/doctor";
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
    const [selectedLocation, setSelectedLocation] = useState<DoctorLocation>();

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
                        label={location?.hospitalName || `Office ${index + 1}`}
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
            {selectedLocation && (
            <>
                <Row className="w-100 m-0 gap-3 py-1 doctor-location">
                    {selectedLocation?.privateOnly}
                    <DoctorLocationAddress
                        doctorLocation={selectedLocation}
                        locationForDistanceCalculation={locationForDistanceCalculation}
                        distanceUnit={distanceUnit}
                    />
                </Row>
                <Row className="w-100 m-0 gap-3 py-1 doctor-location">
                    {selectedLocation?.website && (<Col className="px-0">
                        <Button
                            variant="primary"
                            icon="fa-globe"
                            iconClassName="ps-0 pe-3"
                            href={selectedLocation?.website}
                            target="_blank"
                            label="Website"
                            className="w-min-100-max-content"
                        />
                    </Col>)}
                    {selectedLocation?.email && (<Col className="px-0">
                        <Button
                            variant="secondary"
                            icon="fa-envelope"
                            iconClassName="ps-0 pe-3"
                            href={`mailto:${selectedLocation?.email}`}
                            target="_blank"
                            label={selectedLocation?.email}
                            className="w-min-100-max-content"
                        />
                    </Col>)}
                    {selectedLocation?.phone && (<Col className="px-0">
                        <Button
                            variant="secondary"
                            icon="fa-phone"
                            iconClassName="ps-0 pe-3"
                            href={`tel:${selectedLocation?.phone}`}
                            label={selectedLocation?.phone}
                            className="w-min-100-max-content"
                        />
                    </Col>)}
                    
                </Row>
            </>)}
        </Container>
    );
}

export default DoctorLocations;
