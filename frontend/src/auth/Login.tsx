import { useEffect } from "react";

import useAuth from "./useAuth";
import { mainMapUrl } from "../AppRouter";

function Login() {
    const { login, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            login();
        }
        window.history.replaceState(null, "", mainMapUrl);
    }, []);

    return <></>;
}

export default Login;
