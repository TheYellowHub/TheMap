import { GoogleMap as Map, MarkerF } from "@react-google-maps/api";

import { Location } from "../../utils/googleMaps/useGoogleMaps";
import { Fragment, useEffect, useRef } from "react";

export interface Marker {
    title: string;
    location: Location;
    inBounds: boolean;
    icon?: string;
    onClick?: () => void;
}

interface GoogleMapProps {
    center: Location | undefined;
    markers?: Marker[];
}

const emptyMarkersArray: Marker[] = [];

function GoogleMap({ center, markers = emptyMarkersArray as Marker[] }: GoogleMapProps) {
    const minimalZoom = 13;

    const locationToStr = (location: Location) => `location-${location.lat}/${location.lng}`;
    const mapRef = useRef<google.maps.Map | null>(null);

    const handleMapLoad = (map: google.maps.Map) => {
        mapRef.current = map;
    };

    const fitBounds = () => {
        if (mapRef.current !== null) {
            const bounds = new window.google.maps.LatLngBounds();
            markers.filter((marker) => marker.inBounds).map((marker) => bounds.extend(marker.location));
            if (center !== undefined) {
                bounds.extend(center);
            }
            mapRef.current.fitBounds(bounds);

            const newZoom = Math.min(minimalZoom, mapRef.current.getZoom()!);
            if (newZoom) {
                mapRef.current.setZoom(newZoom);
            }
        }
    };

    useEffect(() => {
        fitBounds();
    }, [markers, center, mapRef]);

    return (
        <div id="map">
            <Map
                key={center && locationToStr(center)}
                mapContainerClassName="map"
                center={center}
                onLoad={handleMapLoad}
            >
                {markers.map((marker) => (
                    <Fragment key={`location-${locationToStr(marker.location)}-${marker.icon}`}>
                        <MarkerF
                            key={`marker-${locationToStr(marker.location)}`}
                            title={marker.title}
                            icon={
                                marker.icon && {
                                    url: marker.icon,
                                }
                            }
                            position={marker.location}
                            onClick={() => {
                                if (marker.onClick !== undefined) {
                                    marker.onClick();
                                }
                            }}
                        />
                    </Fragment>
                ))}
            </Map>
        </div>
    );
}

export default GoogleMap;
