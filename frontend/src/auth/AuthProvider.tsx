import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";

import AuthProviderImpl from "./AuthProviderImpl";

export default function AuthProvider({ children }: React.PropsWithChildren) {
    return (
        <Auth0Provider
            domain={process.env.REACT_APP_AUTH0_DOMAIN!}
            clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
            authorizationParams={{
                redirect_uri: window.location.origin,
                scope: `profile email adminPermission`,
                audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            }}
            cacheLocation="localstorage"
        >
            <AuthProviderImpl>{children}</AuthProviderImpl>
        </Auth0Provider>
    );
}
