import { ReactElement } from "react";
import { Libraries, LoadScriptNext } from "@react-google-maps/api";

import useGoogleMaps from "./useGoogleMaps";

interface GoogleMapsLoaderProps {
    children: ReactElement;
}

function GoogleMapsLoader({ children }: GoogleMapsLoaderProps) {
    const { apiKey } = useGoogleMaps();
    const libraries: Libraries = ["places"];

    return (
        <LoadScriptNext googleMapsApiKey={apiKey!} libraries={libraries}>
            {children}
        </LoadScriptNext>
    );
}

export default GoogleMapsLoader;
