import { get } from "../request";

export type Location = {
    lat: number;
    lng: number;
};

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const urlPrefix = "https://maps.googleapis.com/maps/api";

const locationPerAddressCache = new Map<string, Location>();

const addressPerlocationCache = new Map<Location, string>();

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
    if (address === undefined || address === "") {
        return Promise.resolve(undefined);
    } else if (locationPerAddressCache.has(address)) {
        return Promise.resolve(locationPerAddressCache.get(address));
    } else {
        return get(url)
            .then((response) => {
                const location = response.data.results[0].geometry.location;
                locationPerAddressCache.set(address, location);
                return location;
            })
            .catch((reason: any /* TODO: change any */) => {
                console.log(`getLocation error: ${reason}, address = (${address})`); // TODO: Log?
                return undefined;
            });
    }
}

function getAddress(location: Location): Promise<string | undefined> {
    const url = `${urlPrefix}/geocode/json?latlng=${location.lat},${location.lng}&result_type=street_address&key=${apiKey}`;
    if (addressPerlocationCache.has(location)) {
        return Promise.resolve(addressPerlocationCache.get(location));
    } else {
        return get(url)
            .then((response) => {
                const address = response.data.results[0].formatted_address;
                addressPerlocationCache.set(location, address);
                return address;
            })
            .catch((reason: any /* TODO: change any */) => {
                console.log(`getAddress error: ${reason}, location = (${location})`); // TODO: Log?
                return undefined;
            });
    }
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
