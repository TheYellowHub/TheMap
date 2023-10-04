import { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";

import { Doctor } from "../../../types/doctors/doctor";
import DoctorSmallCard from "../doctors/DoctorSmallCard";
import Pagination from "../../utils/Pagination";
import { DistanceUnit } from "../../utils/DistanceUnit";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";

interface DoctorSearchResultsProps {
    doctors: Doctor[];
    currentDoctor: Doctor | null;
    setCurrentDoctor: (currentDoctor: Doctor | null) => void;
    locationForDistanceCalculation: Location | undefined;
    distanceUnit: DistanceUnit;
}

export default function DoctorSearchResuls({
    doctors,
    currentDoctor,
    setCurrentDoctor,
    locationForDistanceCalculation,
    distanceUnit,
}: DoctorSearchResultsProps) {
    const [doctorsInPage, setDoctorsInPage] = useState<Doctor[]>([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10); // TODO: initial value according to the view, i.e. how many doctors fit in?

    useEffect(() => {
        setDoctorsInPage(() => doctors.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize));
    }, [doctors, pageIndex, pageSize]);

    return (
        <>
            <Row className="p-2 m-2">
                <Container className="doctorSearchResult">
                    {doctorsInPage.map((doctor: Doctor) => (
                        <DoctorSmallCard
                            key={doctor.id}
                            doctor={doctor}
                            locationForDistanceCalculation={locationForDistanceCalculation}
                            distanceUnit={distanceUnit}
                            onClick={() => {
                                setCurrentDoctor(doctor);
                            }}
                        />
                    ))}
                </Container>
            </Row>

            <Row className="p-2 m-2">
                <Pagination
                    rowsCount={doctors.length}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    setPageIndex={setPageIndex}
                    setPageSize={setPageSize}
                />
            </Row>
        </>
    );
}
