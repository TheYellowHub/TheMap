import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

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
        <Container className={`doctorBigCard`}>
            <BackButton />
            <Row className="flex-nowrap p-0 m-0">
                <Col className="flex-grow-0 p-0 pe-1">
                    <DoctorImage doctor={doctor} />
                </Col>
                <Col className="d-grid ps-2 pe-0 py-1 gap-2 align-content-between">
                    <Row className="d-flex p-0 align-content-between h-doctorBigCardImg">
                        <Row className="w-100 m-0 pb-1">
                            <Col className="px-0 doctorBigCardName font-assistant lg-font">{doctor.fullName}</Col>
                            <Col className="px-0 d-flex flex-grow-0 flex-nowrap">
                                <ReportIssueModal doctor={doctor} show={reportingIssue} onHide={() => setReportingIssue(false)} />
                                <Tooltip text="Report an issue" className="only-desktop">
                                    <Col className="px-0 doctorBigCardButtons d-flex justify-content-end" sm="auto">
                                        <Icon icon="fa-circle-info fa-sm" onClick={() => user ? setReportingIssue(true) : login()} />
                                    </Col>
                                </Tooltip>
                                <SaveDoctorIcon doctor={doctor} colClassName="px-0 doctorBigCardButtons d-flex justify-content-end" />
                                <Tooltip text="Close">
                                    <Col className="px-0 doctorBigCardButtons d-flex justify-content-end" sm="auto">
                                        <Icon icon="fa-minus fa-sm" onClick={onClose} className="only-desktop" />
                                    </Col>
                                </Tooltip>
                            </Col>
                        </Row>
                        <Row className="w-100 m-0 gap-4 py-1">
                            <Col className="p-0 flex-grow-0">
                                <DoctorCategoryRibbon category={doctor.category} />
                            </Col>
                            <Col className="p-0 flex-grow-0">
                                <DoctorVerification doctor={doctor} />
                            </Col>
                        </Row>
                        <Row className="m-0 gap-3 pb-1 pt-3 pt-md-1">
                            {doctor.specialities.map((speciality: string) => (
                                <Col className="p-0 m-0 flex-grow-0" key={speciality}>
                                    <DoctorSpecialityRibbon speciality={speciality} />
                                </Col>
                            ))}
                        </Row>
                        <Row className="only-desktop p-0 m-0">
                            <DoctorLocationSelector
                                doctor={doctor}
                                currentDoctorLocation={currentDoctorLocation}
                                setCurrentDoctorLocation={setCurrentDoctorLocation}
                                locationForDistanceCalculation={locationForDistanceCalculation}
                            />
                        </Row>
                    </Row>
                    <Row className="only-desktop p-0 m-0">
                        {currentDoctorLocation && <DoctorLocationCard 
                            doctorLocation={currentDoctorLocation} 
                            locationForDistanceCalculation={locationForDistanceCalculation}
                            distanceUnit={distanceUnit}
                        />}
                    </Row>
                </Col>
            </Row>

            <Row className="only-mobile m-0 p-0 pt-3">
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

            <Row className="m-0 p-0 pt-3">
                <Col className="m-0 p-0">
                    <img src="/images/line.png" className="only-desktop" width="100%" />
                    <Row className="mx-0 py-3">
                        <Col className="p-0 m-0" xs="auto">
                            {doctor.avgRating && doctor.numOfReviews && (
                                <Rating averageRating={doctor.avgRating} totalReviews={doctor.numOfReviews} />
                            )}
                        </Col>

                        <Col className="px-0 d-flex justify-content-end">
                            {!addingReview && !(0 < userReviews?.filter((review) => review.status !== "DELETED").length) && (
                                <a
                                    onClick={() => userInfo ? setAddingReview(true) : login()}
                                    className="inherit-font-style a-no-decoration-line"
                                >
                                    <Icon icon="fa-plus" />
                                    Add a review
                                </a>
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
                                <Row key={review.id!} className="m-0 p-0 pt-4">
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
