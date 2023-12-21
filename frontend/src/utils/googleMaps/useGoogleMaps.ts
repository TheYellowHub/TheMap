import { DistanceUnit, kmToMile } from "../../components/utils/DistanceUnit";
import logError from "../log";

export type Location = {
    lat: number;
    lng: number;
    country?: string;
};

export const locationToStr = (location: Location) => `location-${Number(location.lat).toFixed(7)}/${Number(location.lng).toFixed(7)}`;

export const sameLocation = (a: Location, b: Location) => locationToStr(a) === locationToStr(b)

const locationPerAddressCache = new Map<string, Location>();

const addressPerlocationCache = new Map<Location, string>();

function setCurrentLocation(setLocation: (location: Location) => void): void {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        });
    }
}

function handleError(error: Error, title: string) {
    logError(new Error(`${title}: ${error}`));
}

function getLocation(address: string): Promise<Location | undefined> {
    if (!isLoaded() || address === undefined || address === "") {
        return Promise.resolve(undefined);
    } else if (locationPerAddressCache.has(address)) {
        return Promise.resolve(locationPerAddressCache.get(address));
    } else {
        try {
            const geocoder = new window.google.maps.Geocoder();
            return geocoder
                .geocode({ address: address })
                .then((geocoderResponse: google.maps.GeocoderResponse) => {
                    if (geocoderResponse.results !== null && geocoderResponse.results.length > 0) {
                        const location = {
                            lat: geocoderResponse.results[0].geometry.location.lat(),
                            lng: geocoderResponse.results[0].geometry.location.lng(),
                            country: geocoderResponse.results[0].address_components.slice(-1)[0].short_name,
                        };
                        locationPerAddressCache.set(address, location);
                        return location;
                    } else {
                        throw "Empty results";
                    }
                })
                .catch((error: Error) => {
                    handleError(error, `getLocation error, address = (${address})`);
                    return undefined;
                });
        } catch (error) {
            handleError(error as Error, `getLocation error, address = (${address})`);
            return Promise.resolve(undefined);
        }
    }
}

function getAddress(location: Location): Promise<string | undefined> {
    if (!isLoaded() || location === undefined) {
        return Promise.resolve(undefined);
    } else if (addressPerlocationCache.has(location)) {
        return Promise.resolve(addressPerlocationCache.get(location));
    } else {
        try {
            const geocoder = new window.google.maps.Geocoder();
            return geocoder
                .geocode({ location: location })
                .then((geocoderResponse: google.maps.GeocoderResponse) => {
                    if (geocoderResponse.results !== null && geocoderResponse.results.length > 0) {
                        const address = geocoderResponse.results[0].formatted_address;
                        addressPerlocationCache.set(location, address);
                        return address;
                    } else {
                        throw "Empty results";
                    }
                })
                .catch((error: Error) => {
                    handleError(error, `getAddress error, location = (${location})`);
                    return undefined;
                });
        } catch (error) {
            handleError(error as Error, `getAddress error, location = (${location})`);
            return Promise.resolve(undefined);
        }
    }
}

function getDistance(from: Location, to: Location, distanceUnit?: DistanceUnit): number {
    let distance = window.google.maps.geometry.spherical.computeDistanceBetween(from, to) / 1000;
    if (distanceUnit === "mi" && distance !== Infinity) {
        distance = kmToMile(distance);
    }
    return distance;
}

function isLoaded() {
    return window.google?.maps !== undefined;
}

export default function useGoogleMaps() {
    return {
        isLoaded: isLoaded,
        setCurrentLocation: setCurrentLocation,
        getLocation: getLocation,
        getAddress: getAddress,
        getDistance: getDistance,
    };
}
