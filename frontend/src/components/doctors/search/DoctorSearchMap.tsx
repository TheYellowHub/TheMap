import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

import { Doctor, DoctorLocation } from "../../../types/doctors/doctor";
import useGoogleMaps, { Location } from "../../../utils/googleMaps/useGoogleMaps";
import GoogleMap, { Marker } from "../../map/GoogleMap";
import getMarkerIcon from "../../map/markerIcon";
import Button from "../../utils/Button";

interface DoctorSearchMapProps {
    doctors: Doctor[];
    centerLocation: Location | undefined;
    boundsDistanceFromCenter: number | undefined;
    currentDoctor: Doctor | null;
    setCurrentDoctor: (currentDoctor: Doctor | null) => void;
    currentDoctorLocation: DoctorLocation | null;
    setCurrentDoctorLocation: (currentDoctorLocation: DoctorLocation | null) => void;
}

export default function DoctorSearchMap({
    doctors,
    centerLocation,
    boundsDistanceFromCenter,
    currentDoctor,
    setCurrentDoctor,
    currentDoctorLocation,
    setCurrentDoctorLocation,
}: DoctorSearchMapProps) {
    const { getDistance } = useGoogleMaps();

    const [markers, setMarkers] = useState<Marker[]>([]);

    useEffect(() => {
        const matchedDoctorsMarkers: Marker[] = [];
        for (const doctor of doctors) {
            for (const doctorLocationObj of doctor.locations) {
                if (
                    doctorLocationObj.lat !== undefined &&
                    doctorLocationObj.lat !== null &&
                    doctorLocationObj.lng !== undefined &&
                    doctorLocationObj.lng !== null
                ) {
                    const doctorLocation: Location = {
                        lat: Number(doctorLocationObj.lat!),
                        lng: Number(doctorLocationObj.lng!),
                    };

                    matchedDoctorsMarkers.push({
                        title: doctor.fullName,
                        location: doctorLocation,
                        inBounds:
                            boundsDistanceFromCenter === undefined ||
                            centerLocation === undefined ||
                            getDistance(centerLocation, doctorLocation) <= boundsDistanceFromCenter,
                        icon: getMarkerIcon(
                            doctor,
                            doctor === currentDoctor,
                            doctorLocationObj === currentDoctorLocation
                        ),
                        onClick: () => {
                            setCurrentDoctor(doctor);
                            setCurrentDoctorLocation(doctorLocationObj);
                        },
                    });
                }
            }
            setMarkers(matchedDoctorsMarkers);
        }
    }, [doctors, currentDoctor, currentDoctorLocation]);

    return (
        <Container className="map">
            <GoogleMap center={centerLocation} markers={markers} />
            <div className="aboveMap">
                <a href="https://urlzs.com/bVdAh" target="_blank" rel="noreferrer">
                    <Button variant="primary" label="Recommend a doctor"></Button>
                </a>
            </div>
        </Container>
    );
}
