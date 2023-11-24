import { Container } from "react-bootstrap";
import useAuth from "../../../auth/useAuth";

interface DoctorSearchNoResultsProps {
    address: string | undefined;
    distance: number | undefined;
    setDistance: (distance: number | undefined) => void;
    setShouldClearFilters: (shouldClearFilters: boolean) => void;
    myList: boolean;
}

export default function DoctorSearchNoResuls({
    address,
    distance,
    setDistance,
    setShouldClearFilters,
    myList,
}: DoctorSearchNoResultsProps) {
    const { user } = useAuth();

    return (
        <Container fluid>
            <div className="bold">
                <br />
                No Results found
                <br />
                <br />
                <a href="#" onClick={() => setShouldClearFilters(true)} className="inheritTextStyle">
                    Clear filters
                </a>{" "}
                {myList ? (
                    <>
                        <br />
                        or{" "}
                        {user ? (
                            <>add doctors to your list</>
                        ) : (
                            <a href="#/user/login" className="inheritTextStyle">
                                login in order to create your own list
                            </a>
                        )}
                    </>
                ) : (
                    address &&
                    distance && (
                        <>
                            <br />
                            or{" "}
                            <a href="#" onClick={() => setDistance(distance + 10)} className="inheritTextStyle">
                                try a larger area
                            </a>
                        </>
                    )
                )}
            </div>
        </Container>
    );
}
