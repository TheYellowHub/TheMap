import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";

import { Doctor, DoctorLocation, getDoctorReviews } from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import { DistanceUnit } from "../../utils/DistanceUnit";
import DoctorImage from "./DoctorImage";
import DoctorVerification from "./DoctorVerification";
import DoctorCategoryRibbon from "./DoctorCategory";
import DoctorSpecialityRibbon from "./DoctorSpeciality";
import Icon from "../../utils/Icon";
import Rating from "../../utils/Rating";
import useAuth from "../../../auth/useAuth";
import useUser from "../../../hooks/auth/useUsers";
import SingleReviewCard from "../../reviews/SingleReviewCard";
import UserReviews from "../../reviews/UserReviews";
import DoctorLocationSelector from "./DoctorLocationSelector";
import SaveDoctorIcon from "./SaveDoctorIcon";
import BackButton from "../../utils/BackButton";
import DoctorLocationCard from "./DoctorLocationCard";
import ReportIssueModal from "../../issues/ReportIssueModal";
import { sameUser } from "../../../auth/userInfo";
import Tooltip from "../../utils/Tooltip";
import { getCurrentUrl } from "../../../utils/utils";
import Line from "../../utils/Line";
import Button from "../../utils/Button";

interface DoctorBigCardProps {
    doctor: Doctor;
    currentDoctorLocation: DoctorLocation | null;
    setCurrentDoctorLocation: (currentDoctorLocation: DoctorLocation | null) => void;
    locationForDistanceCalculation?: Location;
    distanceUnit?: DistanceUnit;
    onClose?: () => void;
}

function DoctorBigCard({ doctor, currentDoctorLocation, setCurrentDoctorLocation, locationForDistanceCalculation, distanceUnit = "mi", onClose }: DoctorBigCardProps) {
    const { user, login } = useAuth();
    const { userInfo } = useUser(user);
    const allReviews = getDoctorReviews(doctor);
    const userReviews = allReviews.filter((review) => sameUser(userInfo, review.addedBy));
    const [reportingIssue, setReportingIssue] = useState(false);
    const [addingReview, setAddingReview] = useState(false);
    const addingReviewContainerId = "adding-review-container";

    useEffect(() => {
        document.getElementById(addingReviewContainerId)?.scrollIntoView();
    }, [addingReview]);

    return (
        <Container className={`doctor-big-card d-flex flex-column gap-4`}>
            <BackButton />

            <Helmet>
                <meta property="og:url" content={getCurrentUrl()} />
                <meta property="og:title" content={`${doctor.fullName}, ${doctor.category}`} />
                <meta property="og:description" content={`${doctor.fullName} in ${doctor.locations[0].shortAddress} is an ${doctor.category}, recommended by TheYellowHub community.`} />
                <meta property="og:image" content="/images/logo.png" />
            </Helmet>

            <Row className="flex-nowrap p-0 m-0 gap-4">
                <Col className="flex-grow-0 p-0 m-0">
                    <DoctorImage doctor={doctor} />
                </Col>
                <Col className="d-flex flex-column m-0 p-0 gap-3">
                    <Row className="d-flex m-0 p-0 gap-3">
                        <Row className="w-100 m-0 p-0">
                            <Col className="px-0 font-assistant lg-font">{doctor.fullName}</Col>
                            <Col className="px-0 d-flex flex-grow-0 flex-nowrap">
                                <ReportIssueModal doctor={doctor} show={reportingIssue} onHide={() => setReportingIssue(false)} />
                                <Tooltip text="Report an issue" className="only-tablets-and-desktop">
                                    <Col className="px-0 ps-2 d-flex justify-content-end" sm="auto">
                                        <Icon icon="fa-message-exclamation fa-xs" onClick={() => user ? setReportingIssue(true) : login()} padding={false}/>
                                    </Col>
                                </Tooltip>
                                <SaveDoctorIcon doctor={doctor} colClassName="px-0 ps-2 d-flex justify-content-end" iconClassName="fa-sm" />
                                <Tooltip text="Close" className="px-0 d-flex justify-content-end only-desktop">
                                    <Col className="px-0 ps-2-desktop d-flex justify-content-end only-desktop" sm="auto">
                                        <Icon icon="fa-minus fa-sm" onClick={onClose} className="only-desktop" padding={false}/>
                                    </Col>
                                </Tooltip>
                            </Col>
                        </Row>
                        <Row className="w-100 m-0 p-0 gap-4">
                            <Col className="p-0 d-flex flex-nowrap gap-1">
                                <Col className="p-0 flex-grow-0">
                                    <DoctorCategoryRibbon category={doctor.category} />
                                </Col>
                                <Col className="p-0 flex-grow-0">
                                    <DoctorVerification doctor={doctor} />
                                </Col>
                            </Col>
                            <Col className="p-0 justify-content-end d-flex flex-nowrap gap-1">
                                {doctor.specialities.map((speciality: string) => (
                                    <DoctorSpecialityRibbon speciality={speciality} key={speciality} />
                                ))}
                            </Col>
                        </Row>
                        <Row className="only-tablets-and-desktop p-0 m-0 gap-3">
                            <DoctorLocationSelector
                                doctor={doctor}
                                currentDoctorLocation={currentDoctorLocation}
                                setCurrentDoctorLocation={setCurrentDoctorLocation}
                                locationForDistanceCalculation={locationForDistanceCalculation}
                            />    
                            {currentDoctorLocation && <DoctorLocationCard 
                                doctorLocation={currentDoctorLocation} 
                                locationForDistanceCalculation={locationForDistanceCalculation}
                                distanceUnit={distanceUnit}
                            />}
                        </Row>
                    </Row>
                </Col>
            </Row>

            <Row className="m-0 p-0 only-tablets-and-desktop">
                <Line />
            </Row>

            <Row className="only-mobile m-0 p-0 d-flex flex-column gap-4">
                <DoctorLocationSelector
                    doctor={doctor}
                    currentDoctorLocation={currentDoctorLocation}
                    setCurrentDoctorLocation={setCurrentDoctorLocation}
                    locationForDistanceCalculation={locationForDistanceCalculation}
                    className="px-0"
                />
                {currentDoctorLocation && <DoctorLocationCard 
                    doctorLocation={currentDoctorLocation} 
                    locationForDistanceCalculation={locationForDistanceCalculation}
                    distanceUnit={distanceUnit}
                />}
            </Row>

            <Row className="m-0 p-0 gap-4">
                <Col className="d-flex flex-column m-0 p-0 gap-4">
                    <Row className="m-0 p-0 w-100 d-flex gap-3">
                        <Col className="p-0 m-0 d-flex align-items-center">
                            {doctor.avgRating && doctor.numOfReviews && (
                                <Rating averageRating={doctor.avgRating} totalReviews={doctor.numOfReviews} />
                            )}
                        </Col>
                        <Col className="px-0 d-flex justify-content-end">
                            {!addingReview && !(0 < userReviews?.filter((review) => review.status !== "DELETED").length) && (
                                <Button
                                    label="Add a review"
                                    icon="fa-plus"
                                    onClick={() => userInfo ? setAddingReview(true) : login()}
                                    className="inherit-font-style a-no-decoration-line w-100-mobile"
                                />
                            )}
                        </Col>
                    </Row>

                    {userInfo && (
                        <Row className="mx-0 px-0" id={addingReviewContainerId}>
                            <UserReviews
                                doctor={doctor}
                                addingReview={addingReview}
                                setAddingReview={setAddingReview}
                                allowAddingReview={true}
                                showOnlyEditableReviews={true}
                                showDoctorName={false}
                                containerClassName="px-0 mx-0"
                            />
                        </Row>
                    )}

                    <Row className="m-0">
                        {allReviews
                            .filter((review) => review.status === "APPROVED" && !sameUser(review.addedBy, userInfo))
                            .map((review) => (
                                <Row key={review.id!} className="m-0 p-0">
                                    <SingleReviewCard review={review} />
                                </Row>
                            ))}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default DoctorBigCard;
