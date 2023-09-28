import { ReactElement, useMemo } from "react";
import { Libraries, LoadScriptNext } from "@react-google-maps/api";

interface GoogleMapsLoaderProps {
    children: ReactElement;
}

function GoogleMapsLoader({ children }: GoogleMapsLoaderProps) {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const libraries = useMemo<Libraries>(() => ["places", "geometry"], []);

    return (
        <LoadScriptNext googleMapsApiKey={apiKey!} libraries={libraries}>
            {children}
        </LoadScriptNext>
    );
}

export default GoogleMapsLoader;
