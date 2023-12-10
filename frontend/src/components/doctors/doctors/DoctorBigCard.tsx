import { useState } from "react";
import { Col, Container, OverlayTrigger, Row, Tooltip } from "react-bootstrap";

import { Doctor, getDoctorReviews } from "../../../types/doctors/doctor";
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
import { useUserReviews } from "../../../hooks/doctors/useReviews";
import UserReviewsForm from "../../reviews/UserReviewsForm";
import DoctorLocations from "./DoctorLocations";

interface DoctorBigCardProps {
    doctor: Doctor;
    locationForDistanceCalculation?: Location;
    distanceUnit?: DistanceUnit;
    onClose?: () => void;
}

function DoctorBigCard({ doctor, locationForDistanceCalculation, distanceUnit = "mi", onClose }: DoctorBigCardProps) {
    const allReviews = getDoctorReviews(doctor);

    const { user, isAuthenticated } = useAuth();
    const { userInfo, mutateSavedDoctors } = useUser(user);

    const { data: userReviews } = (userInfo && useUserReviews(userInfo, doctor)) || { data: [] };

    const [addingReview, setAddingReview] = useState(false);

    return (
        <Container className={`doctorBigCard mx-0 ps-0 pe-3 w-100`}>
            <Row className="mb-3">
                <a onClick={onClose} className="a-no-decoration-line">
                    <Col className="only-mobile med-dark-grey sm-font">
                        <Icon icon="fa-arrow-left fa-sm" className="ps-0" />
                        Back
                    </Col>
                </a>
            </Row>
            <Row className="flex-nowrap p-0">
                <Col className="flex-grow-0 pe-1">
                    <DoctorImage doctor={doctor} big={true} />
                </Col>
                <Col className="d-grid px-2 py-2 gap-2 align-content-between">
                    <Row className="w-100 m-0 pb-1">
                        <Col className="px-0 doctorBigCardName font-assistant lg-font">{doctor.fullName}</Col>
                        <Col className="px-0 d-flex flex-grow-0 flex-nowrap">
                            <OverlayTrigger placement="bottom" overlay={<Tooltip className="tooltip">Report an issue</Tooltip>}>
                                <Col className="px-0 doctorBigCardButtons d-flex justify-content-end" sm="auto">
                                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSfgarB_r-MfCtZpnq95XXr-2ZgSNUW92Dbts39Hm9NdGx6P6g/viewform?usp=sf_link" target="_blank" rel="noreferrer">
                                        <Icon icon="fa-circle-info fa-sm " />
                                    </a>
                                </Col>
                            </OverlayTrigger>
                            {user && isAuthenticated && (
                                <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                        <Tooltip className="tooltip">
                                            {userInfo?.savedDoctors?.includes(doctor.id!)
                                                ? "Remove from my list"
                                                : "Add to my list"}
                                        </Tooltip>
                                    }
                                >
                                    <Col className="px-0 doctorBigCardButtons d-flex justify-content-end" sm="auto">
                                        <Icon
                                            icon="fa-bookmark fa-sm"
                                            solid={userInfo?.savedDoctors?.includes(doctor.id!) === true}
                                            onClick={() => {
                                                mutateSavedDoctors(doctor.id!);
                                            }}
                                        />
                                    </Col>
                                </OverlayTrigger>
                            )}
                            <OverlayTrigger placement="bottom" overlay={<Tooltip className="tooltip">Close</Tooltip>}>
                                <Col className="px-0 doctorBigCardButtons d-flex justify-content-end" sm="auto">
                                    <Icon icon="fa-minus fa-sm" onClick={onClose} className="only-desktop" />
                                </Col>
                            </OverlayTrigger>
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
                    <Row className="w-100 m-0 gap-3 py-1">
                        {doctor.specialities.map((speciality: string) => (
                            <Col className="p-0" sm="auto" key={speciality}>
                                <DoctorSpecialityRibbon speciality={speciality} />
                            </Col>
                        ))}
                    </Row>
                    <Row className="only-desktop p-0 m-0">
                        <DoctorLocations
                            doctor={doctor}
                            locationForDistanceCalculation={locationForDistanceCalculation}
                            distanceUnit={distanceUnit}
                        />
                    </Row>
                </Col>
            </Row>

            <Row className="only-mobile m-0 p-0 pt-3">
                <DoctorLocations
                    doctor={doctor}
                    locationForDistanceCalculation={locationForDistanceCalculation}
                    distanceUnit={distanceUnit}
                />
            </Row>

            <Row className="m-0 p-0 pt-3">
                <Col className="m-0 p-0">
                    <img src="images/line.png" className="only-desktop" width="100%" />
                    <Row className="mx-0 pt-3">
                        <Col className="p-0 m-0" sm="auto">
                            {doctor.avgRating && doctor.numOfReviews && (
                                <Rating averageRating={doctor.avgRating} totalReviews={doctor.numOfReviews} />
                            )}
                        </Col>

                        <Col className="px-0 d-flex justify-content-end">
                            {userInfo &&
                                !addingReview &&
                                !(0 < userReviews?.filter((review) => review.status !== "DELETED").length) && (
                                    <a
                                        onClick={() => setAddingReview(true)}
                                        className="inherit-font-style a-no-decoration-line"
                                    >
                                        <Icon icon="fa-plus" />
                                        Add a review
                                    </a>
                                )}
                        </Col>
                    </Row>

                    {userInfo && (
                        <Row className="mx-0 px-0">
                            <UserReviewsForm
                                userInfo={userInfo}
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
                            .filter((review) => review.status == "APPROVED")
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
