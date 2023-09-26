import { useJsApiLoader, Libraries, useLoadScript } from "@react-google-maps/api";
import { get } from "../request";

export type Location = {
    lat: number;
    lng: number;
};

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const urlPrefix = "https://maps.googleapis.com/maps/api";

function setCurrentLocation(setLocation: (location: Location) => void): void {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        });
    }
}

// TODO: error handler

function getLocation(address: string): Promise<Location | undefined> {
    const url = `${urlPrefix}/geocode/json?address=${address}&components=geometry&key=${apiKey}`;
    return get(url)
        .then((response) => {
            return response.data.results[0].geometry.location;
        })
        .catch((reason: any /* TODO: change any */) => {
            console.log(`getLocation error: ${reason}`); // TODO: Log?
            return undefined;
        });
}

function getAddress(location: Location): Promise<string | undefined> {
    const url = `${urlPrefix}/geocode/json?latlng=${location.lat},${location.lng}&result_type=street_address&key=${apiKey}`;
    return get(url)
        .then((response) => {
            return response.data.results[0].formatted_address;
        })
        .catch((reason: any /* TODO: change any */) => {
            console.log(`getAddress error: ${reason}`); // TODO: Log?
            return undefined;
        });
}

export default function useGoogleMaps() {
    const isLoaded = window.google?.maps !== undefined;

    return {
        isLoaded: isLoaded,
        apiKey: apiKey,
        setCurrentLocation: setCurrentLocation,
        getLocation: getLocation,
        getAddress: getAddress,
    };
}
