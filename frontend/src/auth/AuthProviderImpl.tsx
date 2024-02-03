import React, { useCallback, useEffect, useState } from "react";
import jwt from "jwt-decode";
import { useAuth0 } from "@auth0/auth0-react";

import AuthContext from "./AuthContext";
import { AuthState } from "./authState";
import { getCurrentUrl } from "../utils/utils";
import { loginUrl } from "../AppRouter";
import { logEvent } from "../utils/log";

export default function AuthProvider({ children }: React.PropsWithChildren) {
    const {
        error,
        isLoading,
        isAuthenticated,
        user,
        getAccessTokenSilently: getAccessToken,
        loginWithRedirect: auth0login,
        logout: auth0logout,
    } = useAuth0();

    const [isAdmin, setIsAdmin] = useState(false);

    const login = useCallback(async () => {
        const url = getCurrentUrl();
        logEvent("Start login", "UserSession");
        await auth0login({
            appState: url.includes(loginUrl) ? undefined : {
                returnTo: url
            }
        });
        logEvent("Finish login", "UserSession");
    }, [auth0login]);

    const logout = useCallback(async () => {
        logEvent("Start logout", "UserSession");
        await auth0logout();
        logEvent("Finish logout", "UserSession");
    }, [auth0logout]);

    const checkIfAdmin = useCallback(async () => {
        const accessToken = await getAccessToken();
        const decodedToken: { permissions: string[] } = jwt(accessToken);
        const permissions = decodedToken["permissions"];
        setIsAdmin(permissions.includes("adminPermission"));
    }, [getAccessToken]);

    useEffect(() => {
        if (isAuthenticated) {
            checkIfAdmin();
        } else {
            setIsAdmin(false);
        }
    }, [isAuthenticated]);

    const map = {
        // State
        error,
        isAuthenticated,
        isLoading,
        user,
        isAdmin,
        // Auth methods
        login,
        logout,
        getAccessToken,
    } as AuthState;

    return <AuthContext.Provider value={map}>{children}</AuthContext.Provider>;
}
