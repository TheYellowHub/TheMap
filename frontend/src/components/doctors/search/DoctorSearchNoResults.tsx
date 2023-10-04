import { Container } from "react-bootstrap";

interface DoctorSearchNoResultsProps {
    address: string | undefined;
    distance: number | undefined;
    setDistance: (distance: number | undefined) => void;
    setShouldClearFilters: (shouldClearFilters: boolean) => void;
}

export default function DoctorSearchNoResuls({
    address,
    distance,
    setDistance,
    setShouldClearFilters,
}: DoctorSearchNoResultsProps) {
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
                {/* TODO: clear filters */}
                {address && distance && (
                    <>
                        <br />
                        or{" "}
                        <a href="#" onClick={() => setDistance(distance + 10)} className="inheritTextStyle">
                            try a larger area
                        </a>
                    </>
                )}
            </div>
        </Container>
    );
}
