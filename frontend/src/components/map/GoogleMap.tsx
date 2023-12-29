import { GoogleMap as GoogleMapBase, MarkerF, InfoWindowF, useGoogleMap } from "@react-google-maps/api";

import { Location } from "../../utils/googleMaps/useGoogleMaps";
import { Fragment, useEffect, useRef, useState } from "react";
import { locationToStr } from "../../types/doctors/doctor";
import Loader from "../utils/Loader";

export interface Marker {
    title: string;
    location: Location;
    inBounds: boolean;
    icon?: string;
    onClick?: () => void;
}

interface GoogleMapProps {
    center: Location | undefined;
    currentLocation: Location | undefined;
    markers?: Marker[];
    getGroupIcon?: (selected: boolean) => string;
    resetClicks?: () => void;
}

const emptyMarkersArray: Marker[] = [];

function GoogleMap({ center, currentLocation, markers = emptyMarkersArray as Marker[], getGroupIcon, resetClicks }: GoogleMapProps) {
    const minimalZoom = 5;    
    const maximalZoom = 13;
    const mapRef = useRef<google.maps.Map | null>(null);
    const [markersMap, setMarkersMap] = useState(new Map<string, Marker[]>());
    const [currentLocationStr, setCurrentLocationStr] = useState<string | null>();
    const [fitBoundsDone, setFitBoundsDone] = useState(false);
    
    const handleMapLoad = (map: google.maps.Map) => {
        mapRef.current = map;
    };

    const mapMarkers = () => {
        const newMarkersMap = new Map<string, Marker[]>();
        let newLocations = false;

        // New list
        markers.forEach((marker: Marker) => {
            const locationStr = locationToStr(marker.location);
            if (!newMarkersMap.has(locationStr)) {
                newMarkersMap.set(locationStr, []);
            }
            newMarkersMap.get(locationStr)!.push(marker);

            if (!markersMap.has(locationStr)) {
                newLocations = true;
            }
        });

        // Previous list
        Array.from(markersMap.keys()).forEach((locationStr: string) => {
            if (!newMarkersMap.has(locationStr)) {
                newLocations = true;
            }
        });

        setMarkersMap(newMarkersMap);
        if (newLocations) {
            setFitBoundsDone(false);
        }
    };

    const fitBounds = () => {
        if (mapRef.current !== null) {
            const markersInBounds = markers.filter((marker) => marker.inBounds);
            if (0 < markersInBounds.length) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const bounds = new window.google.maps.LatLngBounds();
                markersInBounds.forEach((marker) => bounds.extend(marker.location));
                if (center !== undefined) {
                    bounds.extend(center);
                }
                const originalMinZoom = (mapRef.current as any).minZoom;
                const originalMaxZoom = (mapRef.current as any).maxZoom;
                mapRef.current.setOptions({minZoom: minimalZoom, maxZoom: maximalZoom});
                mapRef.current.fitBounds(bounds);
                mapRef.current.setOptions({minZoom: originalMinZoom, maxZoom: originalMaxZoom});
            } else {
                mapRef.current.setZoom(minimalZoom);
            }
            setFitBoundsDone(true);
        }
    };

    useEffect(() => {
        mapMarkers();
    }, [markers]);

    useEffect(() => {
        setFitBoundsDone(false);
    }, [center]);

    useEffect(() => {
        if (currentLocation) {
            setCurrentLocationStr(locationToStr(currentLocation));
            mapMarkers();
        }
    }, [currentLocation]);

    useEffect(() => {
        if (!fitBoundsDone) {
            fitBounds();
        }
    }, [markers, center, mapRef, fitBoundsDone]);

    return (
        <div id="map" key={`${center && locationToStr(center)}`}>
            <div className="map-is-loading"><br /><br /><Loader size={20} text="Loading map..." center={true} fullHeight={false} marginTop={false} /></div>
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
                        const icon = getGroupIcon && getGroupIcon(currentLocationStr === locationToStr(location));
                        return (<Fragment key={`location-${index}-${locationToStr(location)}-${icon}`}>
                            <MarkerF
                                key={`marker-${index}-${locationToStr(location)}`}
                                icon={icon}
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
                                                    <img src={marker.icon} className="pe-1"/>{marker.title}
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
