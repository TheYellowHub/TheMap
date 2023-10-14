import { ReactNode, useEffect } from "react";

import useAuth from "./useAuth";

type LoginProps = {
    redirectTo: ReactNode;
};

function Login({ redirectTo }: LoginProps) {
    const { login } = useAuth();

    useEffect(() => {
        login();
    });

    return <>{redirectTo}</>;
}

export default Login;
