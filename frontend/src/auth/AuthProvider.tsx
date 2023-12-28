import React, { createContext, useMemo } from "react";
import { Auth0ContextInterface, Auth0Provider, User, initialContext, useAuth0 } from "@auth0/auth0-react";

import AuthProviderImpl from "./AuthProviderImpl";
import { getCurrentUrl } from "../utils/utils";

export const Auth0ProviderWithMemo = createContext<Auth0ContextInterface>(initialContext);

export default function AuthProvider({ children }: React.PropsWithChildren) {
    const { user, ...rest } = useAuth0();

    const contextValue = useMemo<Auth0ContextInterface<User>>(() => {
        return {
            user,
            ...rest,
        };
    }, [user?.updated_at, rest.isLoading, rest.isAuthenticated]);

    const onRedirectCallback = (appState: any) => {
        window.location.replace(
          appState && appState.returnTo ? appState.returnTo : getCurrentUrl()
        );
      };

    return (
        <Auth0Provider
            domain={process.env.REACT_APP_AUTH0_DOMAIN!}
            clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
            authorizationParams={{
                redirect_uri: window.location.origin,
                scope: `profile email adminPermission`,
                audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            }}
            onRedirectCallback={onRedirectCallback}
            cacheLocation="localstorage"
            useRefreshTokens
            useRefreshTokensFallback
        >
            <Auth0ProviderWithMemo.Provider value={contextValue}>
                <AuthProviderImpl>{children}</AuthProviderImpl>
            </Auth0ProviderWithMemo.Provider>
        </Auth0Provider>
    );
}
