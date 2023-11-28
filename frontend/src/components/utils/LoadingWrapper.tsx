import { ResponseError } from "../../hooks/useApiRequest";
import Loader from "./Loader";
import Message from "./Message";

interface LoadingWrapperProps extends React.PropsWithChildren {
    isLoading: boolean;
    isError: boolean;
    error: ResponseError;
    errorClassName?: string;
}

function LoadingWrapper({
    isLoading,
    isError,
    error,
    errorClassName = "alert-padding alert-margin",
    children,
}: LoadingWrapperProps) {
    return (
        <>
            {isLoading ? (
                <Loader />
            ) : isError && error ? (
                <Message variant="danger" className={errorClassName}>
                    {error.message || ""}
                    <br />
                    {error.response?.data ? JSON.stringify(error.response.data) : ""}
                </Message>
            ) : (
                <>{children}</>
            )}
        </>
    );
}

export default LoadingWrapper;
