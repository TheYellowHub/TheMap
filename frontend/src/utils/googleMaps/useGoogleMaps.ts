export type Location = {
    lat: number;
    lng: number;
};

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
    if (address === undefined || address === "") {
        return Promise.resolve(undefined);
    } else if (locationPerAddressCache.has(address)) {
        return Promise.resolve(locationPerAddressCache.get(address));
    } else {
        const geocoder = new window.google.maps.Geocoder();
        return geocoder
            .geocode({ address: address })
            .then((geocoderResponse: google.maps.GeocoderResponse) => {
                if (geocoderResponse.results !== null && geocoderResponse.results.length > 0) {
                    const location = {
                        lat: geocoderResponse.results[0].geometry.location.lat(),
                        lng: geocoderResponse.results[0].geometry.location.lng(),
                    };
                    locationPerAddressCache.set(address, location);
                    return location;
                } else {
                    throw "Empty results";
                }
            })
            .catch((reason: any /* TODO: change any */) => {
                console.log(`getLocation error: ${reason}, address = (${address})`); // TODO: Log?
                return undefined;
            });
    }
}

function getAddress(location: Location): Promise<string | undefined> {
    if (addressPerlocationCache.has(location)) {
        return Promise.resolve(addressPerlocationCache.get(location));
    } else {
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
            .catch((reason: any /* TODO: change any */) => {
                console.log(`getAddress error: ${reason}, location = (${location})`); // TODO: Log?
                return undefined;
            });
    }
}

function getDistance(from: Location, to: Location): number {
    return window.google.maps.geometry.spherical.computeDistanceBetween(from, to) / 1000;
}

export default function useGoogleMaps() {
    const isLoaded = window.google?.maps !== undefined;

    return {
        isLoaded: isLoaded,
        setCurrentLocation: setCurrentLocation,
        getLocation: getLocation,
        getAddress: getAddress,
        getDistance: getDistance,
    };
}
