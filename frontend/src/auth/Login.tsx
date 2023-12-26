import { useEffect } from "react";

import useAuth from "./useAuth";
import { mainMapUrl } from "../AppRouter";

function Login() {
    const { login } = useAuth();

    useEffect(() => {
        login();
        window.history.replaceState(null, "", mainMapUrl);
    });

    return <></>;
}

export default Login;
