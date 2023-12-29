import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import { Doctor, DoctorLocation, getDoctorUrl, locationToStr } from "../../../types/doctors/doctor";
import useGoogleMaps, { Location } from "../../../utils/googleMaps/useGoogleMaps";
import GoogleMap, { Marker } from "../../map/GoogleMap";
import { getDoctorMarkerIcon, getGroupMarkerIcon } from "../../map/markerIcon";
import Button from "../../utils/Button";
import Icon from "../../utils/Icon";

interface DoctorSearchMapProps {
    doctors: Doctor[];
    centerLocation: Location | undefined;
    boundsDistanceFromCenter: number | undefined;
    currentDoctor: Doctor | null;
    setCurrentDoctor: (currentDoctor: Doctor | null) => void;
    currentDoctorLocation: DoctorLocation | null;
    setCurrentDoctorLocation: (currentDoctorLocation: DoctorLocation | null) => void;
    onlyMyList?: boolean;
}

export default function DoctorSearchMap({
    doctors,
    centerLocation,
    boundsDistanceFromCenter,
    currentDoctor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setCurrentDoctor,
    currentDoctorLocation,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setCurrentDoctorLocation,
    onlyMyList = false
}: DoctorSearchMapProps) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
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
                            boundsDistanceFromCenter === undefined
                            || centerLocation === undefined 
                            || getDistance(centerLocation, doctorLocation) <= boundsDistanceFromCenter
                            || doctorLocationObj === currentDoctorLocation,
                        icon: getDoctorMarkerIcon(
                            doctor,
                            doctor === currentDoctor,
                            doctorLocationObj === currentDoctorLocation
                        ),
                        onClick: () => {
                            const url = getDoctorUrl(doctor, onlyMyList);
                            if (url !== pathname) {
                                navigate(url);
                                setCurrentDoctorLocation(doctorLocationObj);
                            }
                        },
                    });
                }
            }
            
            setMarkers(matchedDoctorsMarkers);
        }
    }, [doctors, currentDoctor, currentDoctorLocation, centerLocation, boundsDistanceFromCenter]);

    return (
        <Container fluid className="map px-0 mx-0" key={`search-map-distance=${boundsDistanceFromCenter}-center=${centerLocation && locationToStr(centerLocation)}`}>
            <GoogleMap 
                center={centerLocation} 
                currentLocation={currentDoctorLocation?.lat && currentDoctorLocation?.lng  && {lat: currentDoctorLocation.lat, lng: currentDoctorLocation.lng} || undefined}
                markers={markers} 
                getGroupIcon={getGroupMarkerIcon}
            />
            <div className="above-map add-doctor">
                <a href="https://urlzs.com/bVdAh" target="_blank" rel="noreferrer">
                    <Button variant="primary" label="Recommend a doctor"></Button>
                </a>
            </div>
            <div className="above-map legend">
                <Icon icon="fa-circle-info" className="gm-control-active" />    {/* TODO: style + open a legend */}
                {/* gm-control-active / background: none rgb(255, 255, 255); border: 0px; margin: 10px; padding: 0px; text-transform: none; appearance: none; position: absolute; cursor: pointer; user-select: none; border-radius: 2px; height: 40px; width: 40px; box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px; overflow: hidden; top: 0px; right: 0px; */}
            </div>
        </Container>
    );
}
