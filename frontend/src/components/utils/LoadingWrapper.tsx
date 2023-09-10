import Loader from "./Loader";
import Message from "./Message";

interface LoadingWrapperProps extends React.PropsWithChildren {
    isLoading: boolean;
    isError: boolean;
    error: unknown; // TODO: change unknown ?
}

function LoadingWrapper({ isLoading, isError, error, children }: LoadingWrapperProps) {
    return (
        <>
            {isLoading ? (
                <Loader />
            ) : isError && error ? (
                <Message variant="danger">{String(error)}</Message>
            ) : (
                <>{children}</>
            )}
        </>
    );
}

export default LoadingWrapper;
