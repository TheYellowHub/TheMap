import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import { Doctor, DoctorLocation, getDoctorUrl, locationToStr } from "../../../types/doctors/doctor";
import useGoogleMaps, { Location } from "../../../utils/googleMaps/useGoogleMaps";
import GoogleMap, { Marker } from "../../map/GoogleMap";
import { getDoctorMarkerIcon, getGroupMarkerIcon } from "../../map/markerIcon";
import Button from "../../utils/Button";
import Icon from "../../utils/Icon";
import DoctorSearchMapLegend from "./DoctorSearchMapLegend";

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
    const [legendIsOpen, setLegendIsOpen] = useState(false);

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
            >  
                <div className="above-map add-doctor">
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLScXkk35fRFrQ34IAZGwdkXw0Q4Y-66figgCQaYJOVyesMqY-w/viewform?usp=sf_link" target="_blank" rel="noreferrer">
                        <Button variant="primary" label="Recommend a doctor"></Button>
                    </a>
                </div>
                <div className="above-map legend d-flex justify-content-end">
                   
                        {legendIsOpen 
                            ? <DoctorSearchMapLegend markers={markers} onClick={() => setLegendIsOpen(false)} />
                            :  <div className="gm-control-active-copy w-fit-content d-flex justify-content-center align-items-center"> 
                                    <Icon icon="fa-circle-info" onClick={() => setLegendIsOpen(true)} />
                               </div>
                        }
                </div>
            </GoogleMap>
        </Container>
    );
}
