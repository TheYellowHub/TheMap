import { Container } from "react-bootstrap";

import config from "../../../config.json";

interface DoctorSearchNoResultsProps {
    address: string | undefined;
    distance: number | undefined;
    setDistance: (distance: number | undefined) => void;
    setShouldClearFilters: (shouldClearFilters: boolean) => void;
    setShouldClearAddress: (shouldClearFilters: boolean) => void;
}

export default function DoctorSearchNoResuls({
    address,
    distance,
    setDistance,
    setShouldClearFilters,
    setShouldClearAddress,
}: DoctorSearchNoResultsProps) {
    return (
        <Container fluid>
            <div className="bold">
                <br />
                No Results found
                <br />
                <br />
                <a onClick={() => {
                    setShouldClearFilters(true);
                    setShouldClearAddress(true);
                }} className="inherit-font-style">
                    Clear filters
                </a>
                {address && distance && (
                        <>
                            <br />
                            or{" "}
                            <a onClick={() => setDistance(distance + config.app.distanceJumps)} className="inherit-font-style">
                                try a larger area
                            </a>
                        </>
                    )
                }
            </div>
        </Container>
    );
}
