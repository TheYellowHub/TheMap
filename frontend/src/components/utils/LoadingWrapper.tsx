import { ResponseError } from "../../hooks/useApiRequest";
import Loader from "./Loader";
import Message from "./Message";

interface LoadingWrapperProps extends React.PropsWithChildren {
    isLoading: boolean;
    isError: boolean;
    error: ResponseError;
    errorClassName?: string;
    loaderSize?: number;
    loaderText?: string;
    center?: boolean
}

function LoadingWrapper({
    isLoading,
    isError,
    error,
    errorClassName = "alert-padding alert-margin",
    loaderSize = 100,
    loaderText = "Loading...",
    center = false,
    children,
}: LoadingWrapperProps) {
    return (
        <>
            {isLoading ? (
                <Loader size={loaderSize} text={loaderText} center={center} />
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
