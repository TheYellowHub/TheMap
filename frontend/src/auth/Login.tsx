import { ReactNode, useEffect } from "react";

import useAuth from "./useAuth";

function Login() {
    const { login } = useAuth();

    useEffect(() => {
        login();
        window.history.replaceState(null, "", "/");
    });

    return <></>;
}

export default Login;
