import { ResponseError } from "../../hooks/useApiRequest";
import Loader from "./Loader";
import Message from "./Message";

interface LoadingWrapperProps extends React.PropsWithChildren {
    isLoading: boolean;
    isError: boolean;
    error: ResponseError;
}

function LoadingWrapper({ isLoading, isError, error, children }: LoadingWrapperProps) {
    return (
        <>
            {isLoading ? (
                <Loader />
            ) : isError && error ? (
                <Message variant="danger">
                    {error.message}
                    <br />
                    {JSON.stringify(error.response.data)}
                </Message>
            ) : (
                <>{children}</>
            )}
        </>
    );
}

export default LoadingWrapper;
