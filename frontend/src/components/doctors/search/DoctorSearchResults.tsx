import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";

import { Doctor, DoctorLocation, getDoctorUrl } from "../../../types/doctors/doctor";
import DoctorSmallCard, { doctorSmallCardClassName } from "../doctors/DoctorSmallCard";
import Pagination from "../../utils/Pagination";
import { DistanceUnit } from "../../utils/DistanceUnit";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import DoctorBigCard from "../doctors/DoctorBigCard";


interface DoctorSearchResultsProps {
    doctors: Doctor[];
    currentDoctor: Doctor | null;
    setCurrentDoctor: (currentDoctor: Doctor | null) => void;
    currentDoctorLocation: DoctorLocation | null;
    setCurrentDoctorLocation: (currentDoctorLocation: DoctorLocation | null) => void;
    locationForDistanceCalculation: Location | undefined;
    distanceUnit: DistanceUnit;
    isMapBelowRsults: () => boolean;
    pagination?: boolean;
    onlyMyList?: boolean;
}

export default function DoctorSearchResuls({
    doctors,
    currentDoctor,
    setCurrentDoctor,
    currentDoctorLocation,
    setCurrentDoctorLocation,
    locationForDistanceCalculation,
    distanceUnit,
    isMapBelowRsults,
    pagination = false,
    onlyMyList = false
}: DoctorSearchResultsProps) {
    const navigate = useNavigate();

    const [doctorsInPage, setDoctorsInPage] = useState<Doctor[]>([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageYOffset, setPageYOffset] = useState<number | undefined>(undefined);
    const [onlyDivScroll, setOnlyDivScroll] = useState(false);

    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    
    const doctorCardsContainerId = "doctorSmallCards";

    const doctorsSmallCards = useMemo(() => doctorsInPage.map((doctor: Doctor) => (
        <DoctorSmallCard
            key={doctor.id}
            doctor={doctor}
            locationForDistanceCalculation={locationForDistanceCalculation}
            onClick={() => {
                setPageYOffset(onlyDivScroll ? document.getElementById(doctorCardsContainerId)?.scrollTop : window.scrollY);
                navigate(getDoctorUrl(doctor, onlyMyList));
            }}
        />
    )), [doctorsInPage, locationForDistanceCalculation]);

    const currentDoctorBigCard = currentDoctor && (
        <DoctorBigCard
            doctor={currentDoctor}
            currentDoctorLocation={currentDoctorLocation}
            setCurrentDoctorLocation={setCurrentDoctorLocation}
            locationForDistanceCalculation={locationForDistanceCalculation}
            distanceUnit={distanceUnit}
            onClose={() => {
                setCurrentDoctor(null);
                setCurrentDoctorLocation(null);
            }}
        />
    );

    const readjustPageSize = () => {
        const cardsDiv = document.getElementById(doctorCardsContainerId);
        const footer = document.getElementsByName("footer");
        const isMapBelowRsultsNow = isMapBelowRsults();
        const newOnlyDivScroll = !pagination && !isMapBelowRsultsNow;
        setOnlyDivScroll(newOnlyDivScroll);

        if (cardsDiv !== null) {
            const cardsDivHeight = window.innerHeight - (0 < footer.length ? footer[0].getBoundingClientRect().top : 0) - cardsDiv.getBoundingClientRect().top - 60;
            cardsDiv.style.maxHeight = newOnlyDivScroll ? (cardsDivHeight.toString() + "px") : "none";

            if (!isMapBelowRsultsNow) {
                const scrollerWidth = 30;
                const cardsDivWidth = Math.min(0.70 * window.innerWidth - scrollerWidth, window.innerWidth - 300);
                const rem = 16;
                const paddingBetween = window.innerWidth * 0.1;
                const doctorCards = Array.from(document.getElementsByClassName(doctorSmallCardClassName));
                const cardWidth = 0 < doctorCards.length ? doctorCards[0].clientWidth : 26 * rem;
                const cardHeight = 0 < doctorCards.length ? doctorCards[0].clientHeight : 9 * rem;
                // cardsDivWidth = cols * cardWidth + (cols - 1) * paddingBetween
                const cols = Math.max(1, Math.floor((cardsDivWidth + paddingBetween) / (cardWidth + paddingBetween)));
                const rows = Math.max(1, Math.floor((cardsDivHeight + paddingBetween) / (cardHeight + paddingBetween)));

                const width = (cols * cardWidth + (cols - 1) * paddingBetween + scrollerWidth).toString() + "px";
                cardsDiv.style.minWidth = width;

                if (pagination) {
                    const newPageSize = cols * rows;
                    if (pageSize !== newPageSize) {
                        setPageSize(newPageSize);
                    }
                }
            }
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
        if (pageYOffset !== undefined && currentDoctor === null) {
            (onlyDivScroll ? document.getElementById(doctorCardsContainerId)! : window).scrollTo(0, pageYOffset);
        }
    });

    useEffect(() => {
        window.addEventListener("resize", handleResize, false);
        readjustPageSize();
    }, []);

    useEffect(() => {
        setDoctorsInPage(() => pagination === true ? (doctors.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)) : doctors);
    }, [doctors, pageIndex, pageSize, pagination]);

    return (
        <>
            <Row className="px-0 mx-0">
                <Container
                    id={doctorCardsContainerId}
                    className={`d-flex flex-wrap row-gap-4 column-gap-10p px-0 mx-0 mx-0 ${onlyDivScroll ? "overflow-y-auto-hover" : ""}`}
                >
                    {currentDoctor === null ? doctorsSmallCards : currentDoctorBigCard}
                </Container>
            </Row>

            {pagination === true && currentDoctor === null && (
                <Row className="px-0 mx-0 py-2 my-2">
                    <Col>
                        <Pagination
                            rowsCount={doctors.length}
                            pageIndex={pageIndex}
                            pageSize={pageSize}
                            setPageIndex={setPageIndex}
                            setPageSize={undefined}
                        />
                    </Col>
                </Row>
            )}
        </>
    );
}
