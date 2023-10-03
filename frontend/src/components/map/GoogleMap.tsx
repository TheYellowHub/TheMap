import { GoogleMap as Map, MarkerF, InfoWindowF } from "@react-google-maps/api";

import { Location } from "../../utils/googleMaps/useGoogleMaps";
import { Fragment, useEffect, useRef, useState } from "react";

interface MarkersGroup<T> {
    obj: T;
    title: string;
    locations: Location[];
    showInfoWindow: (t: T) => boolean;
    onClosingInfoWindow?: () => void;
    onClick?: () => void;
}

interface GoogleMapProps<T> {
    center: Location | undefined;
    markers?: MarkersGroup<T>[];
}

const emptyMarkersArray: MarkersGroup<unknown>[] = [];

function GoogleMap<T>({ center, markers = emptyMarkersArray as MarkersGroup<T>[] }: GoogleMapProps<T>) {
    const minimalZoom = 13;
    const locationToStr = (location: Location) => `location-${location.lat}/${location.lng}`;
    const mapRef = useRef<google.maps.Map | null>(null);

    const handleMapLoad = (map: google.maps.Map) => {
        mapRef.current = map;
    };

    const fitBounds = () => {
        if (mapRef.current !== null) {
            const bounds = new window.google.maps.LatLngBounds();
            markers.map((markersGroup) => markersGroup.locations.map((location) => bounds.extend(location)));
            if (center !== undefined) {
                bounds.extend(center);
            }
            mapRef.current.fitBounds(bounds);

            const newZoom = Math.min(minimalZoom, mapRef.current.getZoom()!);
            mapRef.current.setZoom(newZoom);
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
                {markers.map((markersGroup) =>
                    markersGroup.locations.map((location) => (
                        <Fragment key={`location-${locationToStr(location)}`}>
                            <MarkerF
                                key={`marker-${locationToStr(location)}`}
                                title={markersGroup.title}
                                position={location}
                                onClick={() => {
                                    if (markersGroup.onClick !== undefined) {
                                        markersGroup.onClick();
                                    }
                                }}
                            />
                            {markersGroup.showInfoWindow(markersGroup.obj) && (
                                <InfoWindowF
                                    key={`info-window-${locationToStr(location)}`}
                                    position={location}
                                    onCloseClick={markersGroup.onClosingInfoWindow}
                                >
                                    <p>{markersGroup.title}</p>
                                </InfoWindowF>
                            )}
                        </Fragment>
                    ))
                )}
            </Map>
        </div>
    );
}

export default GoogleMap;
