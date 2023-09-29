import { GoogleMap as Map, Marker, InfoWindowF } from "@react-google-maps/api";

import { Location } from "../../utils/googleMaps/useGoogleMaps";
import { Fragment } from "react";

interface MarkersGroup<T> {
    obj: T;
    title: string;
    locations: Location[];
    showInfoWindow: (t: T) => boolean;
    onClosingInfoWindow?: () => void;
    onClick?: () => void;
}

interface GoogleMapProps<T> {
    center: Location;
    zoom?: number;
    markers?: MarkersGroup<T>[];
}

const emptyMarkersArray: MarkersGroup<unknown>[] = [];

function GoogleMap<T>({ center, zoom = 13, markers = emptyMarkersArray as MarkersGroup<T>[] }: GoogleMapProps<T>) {
    const locationToStr = (location: Location) => `location-${location.lat}/${location.lng}`;

    return (
        <div id="map">
            <Map mapContainerClassName="map" center={center} zoom={zoom} key={locationToStr(center)}>
                {markers.map((markersGroup) =>
                    markersGroup.locations.map((location) => (
                        <Fragment key={`location-${locationToStr(location)}`}>
                            <Marker
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
