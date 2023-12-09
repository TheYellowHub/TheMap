import { GoogleMap as GoogleMapBase, MarkerF, InfoWindowF } from "@react-google-maps/api";

import { Location } from "../../utils/googleMaps/useGoogleMaps";
import { Fragment, useEffect, useRef, useState } from "react";

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
    resetClicks?: () => void;
}

const emptyMarkersArray: Marker[] = [];

function GoogleMap({ center, markers = emptyMarkersArray as Marker[], resetClicks }: GoogleMapProps) {
    const minimalZoom = 13;
    const mapRef = useRef<google.maps.Map | null>(null);
    const [markersMap, setMarkersMap] = useState(new Map<string, Marker[]>());
    const [currentLocationStr, setCurrentLocationStr] = useState<string | null>();

    const locationToStr = (location: Location) => `location-${location.lat}/${location.lng}`;

    const handleMapLoad = (map: google.maps.Map) => {
        mapRef.current = map;
    };

    const mapMarkers = () => {
        const newMarkersMap = new Map<string, Marker[]>();
        markers.forEach((marker: Marker) => {
            const locationStr = locationToStr(marker.location);
            if (!newMarkersMap.has(locationStr)) {
                newMarkersMap.set(locationStr, []);
            }

            newMarkersMap.get(locationStr)!.push(marker);
        });
        setMarkersMap(newMarkersMap);

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
        mapMarkers();
    }, [markers]);

    useEffect(() => {
        fitBounds();
    }, [markers, center, mapRef]);

    return (
        <div id="map" key={`${center && locationToStr(center)}`}>
            <GoogleMapBase
                key={`${center && locationToStr(center)}`}
                mapContainerClassName="map"
                center={center}
                onLoad={handleMapLoad}
            >
                {Array.from(markersMap.keys()).map((locationStr, index) => {
                    const markers = markersMap.get(locationStr);
                    if (markers?.length === 1) {
                        const marker = markers[0];
                        return (<Fragment key={`location-${index}-${locationToStr(marker.location)}-${marker.icon}`}>
                            <MarkerF
                                key={`marker-${index}-${locationToStr(marker.location)}`}
                                title={marker.title}
                                icon={
                                    marker.icon && {
                                        url: marker.icon,
                                    }
                                }
                                position={marker.location}
                                onClick={() => {
                                    resetClicks && resetClicks();
                                    setCurrentLocationStr(locationToStr(marker.location));
                                    if (marker.onClick !== undefined) {
                                        marker.onClick();
                                    }
                                }}
                            >
                            </MarkerF>
                        </Fragment>);
                    } else {
                        const location = markers![0].location;
                        return (<Fragment key={`location-${index}-${locationToStr(location)}-group`}>
                            <MarkerF
                                key={`marker-${index}-${locationToStr(location)}`}
                                // TODO: 
                                // icon={
                                //     marker.icon && {
                                //         url: marker.icon,
                                //     }
                                // }
                                position={location}
                                onClick={() => {
                                    resetClicks && resetClicks();
                                    setCurrentLocationStr(currentLocationStr === null ? locationStr : null);
                                }}
                            >
                                {currentLocationStr === locationStr && <InfoWindowF position={location}>
                                    <>
                                        {markers?.map((marker, index) =>  (
                                            <div key={`${locationToStr(location)}-link-${index}`}>
                                                <a onClick={() => {
                                                    if (marker.onClick !== undefined) {
                                                        marker.onClick();
                                                    }
                                                }}>
                                                    <img src={marker.icon}/>{marker.title}
                                                </a>
                                            </div>
                                        ))}
                                    </>
                                </InfoWindowF>}
                            </MarkerF>
                        </Fragment>);
                    }
                })}
            </GoogleMapBase>
        </div>
    );
}

export default GoogleMap;
