import React, { useCallback, useEffect, useState } from "react";
import jwt from "jwt-decode";
import { useAuth0 } from "@auth0/auth0-react";

import AuthContext from "./AuthContext";
import { AuthState } from "./authState";

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
        await auth0login();
        console.log(user);
    }, [auth0login]);

    const logout = useCallback(async () => {
        await auth0logout({
            logoutParams: { returnTo: window.location.origin },
        });
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
