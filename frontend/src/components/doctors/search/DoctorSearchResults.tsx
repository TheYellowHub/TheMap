import { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";

import { Doctor } from "../../../types/doctors/doctor";
import DoctorSmallCard, { doctorSmallCardClassName } from "../doctors/DoctorSmallCard";
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
    const [pageSize, setPageSize] = useState(10);

    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const doctorCardsContainerId = "doctorSmallCards";

    const readjustPageSize = () => {
        const rem = 16;

        const doctorCards = Array.from(document.getElementsByClassName(doctorSmallCardClassName));
        const cardWidth = 0 < doctorCards.length ? doctorCards[0].clientWidth : 26 * rem;
        const cardHeight = 0 < doctorCards.length ? doctorCards[0].clientHeight : 9 * rem;

        const cardsDiv = document.getElementById(doctorCardsContainerId);
        const cardsDivWidth = cardsDiv!.clientWidth;
        const cardsDivHeight = window.innerHeight - 300;

        const cols = Math.max(1, Math.floor(cardsDivWidth / (cardWidth + 1.5 * rem)));
        const rows = Math.max(1, Math.floor(cardsDivHeight / (cardHeight + 1.5 * rem)));
        const newPageSize = cols * rows;
        if (pageSize !== newPageSize) {
            setPageSize(newPageSize);
        }
    };

    const handleResize = () => {
        if (dimensions.width !== window.innerWidth || dimensions.height !== window.innerHeight) {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
            readjustPageSize();
        }
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize, false);
        readjustPageSize();
    }, []);

    useEffect(() => {
        setDoctorsInPage(() => doctors.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize));
    }, [doctors, pageIndex, pageSize]);

    return (
        <>
            <Row className="px-0 mx-0 py-2 my-2">
                <Container id="doctorSmallCards" className="d-flex flex-wrap gap-4 justify-content-between px-0 mx-0">
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

            <Row className="px-0 mx-0 py-2 my-2">
                <Pagination
                    rowsCount={doctors.length}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    setPageIndex={setPageIndex}
                    setPageSize={undefined} // setPageSize
                />
            </Row>
        </>
    );
}
