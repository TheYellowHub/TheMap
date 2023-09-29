import { ReactElement, useEffect, useMemo, useState } from "react";
import { Libraries, LoadScriptNext } from "@react-google-maps/api";

interface GoogleMapsLoaderProps {
    setGoogleMapsIsLoaded: (setGoogleMapsIsLoaded: boolean) => void;
    children: ReactElement;
}

declare global {
    interface Window {
        gm_authFailure: () => void;
    }
}

function GoogleMapsLoader({ setGoogleMapsIsLoaded, children }: GoogleMapsLoaderProps) {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const libraries = useMemo<Libraries>(() => ["places", "geometry"], []);

    const [wasLoaded, setWasLoaded] = useState(false);

    const handleLoadingError = (error: Error) => {
        if (process.env.NODE_ENV === "development") {
            console.log(`Google maps failed to load: ${error}`);
        }
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
            <>{children}</>
        </LoadScriptNext>
    );
}

export default GoogleMapsLoader;
