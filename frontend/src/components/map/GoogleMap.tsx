import { useEffect, useState } from "react";
import { GoogleMap as Map, useJsApiLoader, InfoWindow, Marker, Libraries } from "@react-google-maps/api";

import useGoogleMaps, { Location } from "../../utils/googleMaps/useGoogleMaps";

interface MarkersGroup {
    name: string;
    locations: Location[];
    onClick?: () => void;
}

interface GoogleMapProps {
    center: Location;
    zoom?: number;
    markers?: MarkersGroup[];
    // TODO: marker style?
}

const emptyMarkersArray: MarkersGroup[] = [];

function GoogleMap({ center, zoom = 15, markers = emptyMarkersArray }: GoogleMapProps) {
    const { isLoaded } = useGoogleMaps();

    const [allMarkers, setAllMarkers] = useState<MarkersGroup[]>([]);
    const [selectedMarkersGroup, setSelectedMarkersGroup] = useState<MarkersGroup | undefined>();
    const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();

    const locationToStr = (location: Location) => `location-${location.lat}/${location.lng}`;

    useEffect(() => {
        const centerMarker: MarkersGroup = {
            name: "Your location",
            locations: [center],
        };
        setAllMarkers([...markers, centerMarker]);
    }, [center, markers]);

    return (
        <div id="map">
            {isLoaded && (
                <Map mapContainerClassName="map" center={center} zoom={zoom} key={locationToStr(center)}>
                    {allMarkers.map((markersGroup) =>
                        markersGroup.locations.map((location) => (
                            <Marker
                                key={locationToStr(location)}
                                position={location}
                                onClick={() => {
                                    setSelectedMarkersGroup(markersGroup);
                                    setSelectedLocation(location);
                                    if (markersGroup.onClick !== undefined) {
                                        markersGroup.onClick();
                                    }
                                }}
                            />
                        ))
                    )}
                    {selectedMarkersGroup && selectedLocation && (
                        <InfoWindow
                            position={selectedLocation}
                            onCloseClick={() => {
                                setSelectedMarkersGroup(undefined);
                                setSelectedLocation(undefined);
                            }}
                        >
                            <p>{selectedMarkersGroup.name}</p>
                        </InfoWindow>
                    )}
                </Map>
            )}
        </div>
    );
}

export default GoogleMap;
