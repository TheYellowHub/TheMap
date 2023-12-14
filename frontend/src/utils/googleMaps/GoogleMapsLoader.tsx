import { ReactElement, createContext, useEffect, useMemo, useState } from "react";
import { Libraries, LoadScriptNext } from "@react-google-maps/api";

import logError from "../log";

export const GoogleMapsLoaderContext = createContext(false);

declare global {
    interface Window {
        gm_authFailure: () => void;
    }
}

interface GoogleMapsLoaderProps {
    children: ReactElement;
}

function GoogleMapsLoader({ children }: GoogleMapsLoaderProps) {
    const [googleMapsIsLoaded, setGoogleMapsIsLoaded] = useState(false);

    const apiKey = process.env.REACT_APP_GMAPS_API_KEY;
    const libraries = useMemo<Libraries>(() => ["places", "geometry"], []);

    const [wasLoaded, setWasLoaded] = useState(false);

    const handleLoadingError = (error: Error) => {
        logError(new Error(`Google maps failed to load: ${error}`));
        setGoogleMapsIsLoaded(false);
    };

    window.gm_authFailure = () => {
        handleLoadingError(new Error("Auth failure"));
    };

    useEffect(() => {
        if (!wasLoaded) {
            setGoogleMapsIsLoaded(true);
        }
    }, []);

    return (
        <LoadScriptNext
            googleMapsApiKey={apiKey!}
            libraries={libraries}
            onError={(error: Error) => handleLoadingError(error)}
            onLoad={() => setWasLoaded(true)}
        >
            <GoogleMapsLoaderContext.Provider value={googleMapsIsLoaded}>
                <>{children}</>
            </GoogleMapsLoaderContext.Provider>
        </LoadScriptNext>
    );
}

export default GoogleMapsLoader;
