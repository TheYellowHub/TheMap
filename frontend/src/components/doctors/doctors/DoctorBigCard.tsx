import { useState } from "react";
import { Col, Container, OverlayTrigger, Row, Tooltip } from "react-bootstrap";

import { Doctor, getDoctorNearestLocation, getDoctorReviews } from "../../../types/doctors/doctor";
import { Location } from "../../../utils/googleMaps/useGoogleMaps";
import { DistanceUnit } from "../../utils/DistanceUnit";
import DoctorImage from "./DoctorImage";
import DoctorVerification from "./DoctorVerification";
import DoctorCategoryRibbon from "./DoctorCategory";
import DoctorSpecialityRibbon from "./DoctorSpeciality";
import DoctorLocationAddress from "./DoctorLocationAddress";
import Icon from "../../utils/Icon";
import Button from "../../utils/Button";
import Rating from "../../utils/Rating";
import useAuth from "../../../auth/useAuth";
import useUser from "../../../hooks/auth/useUsers";
import SingleReviewCard from "../../reviews/SingleReviewCard";
import { useUserReviews } from "../../../hooks/doctors/useReviews";
import UserReviewsForm from "../../reviews/UserReviewsForm";

interface DoctorBigCardProps {
    doctor: Doctor;
    locationForDistanceCalculation?: Location;
    distanceUnit?: DistanceUnit;
    onClose?: () => void;
}

function DoctorBigCard({ doctor, locationForDistanceCalculation, distanceUnit = "mi", onClose }: DoctorBigCardProps) {
    const closestLocation =
        locationForDistanceCalculation && getDoctorNearestLocation(doctor, locationForDistanceCalculation);

    const [selectedLocation, setSelectedLocation] = useState(closestLocation || doctor.locations[0]);

    const allReviews = getDoctorReviews(doctor);

    const { user, isAuthenticated } = useAuth();
    const { userInfo, mutateSavedDoctors } = useUser(user);

    const { data: userReviews } = (userInfo && useUserReviews(userInfo, doctor)) || { data: [] };

    const [addingReview, setAddingReview] = useState(false);

    return (
        <Container className={`doctorBigCard mx-0 ps-0 pe-3`} fluid>
            <Row className="flex-nowrap">
                <Col className="flex-grow-0 pe-1">
                    <DoctorImage doctor={doctor} big={true} />
                </Col>
                <Col className="d-grid px-2 py-2 gap-2 align-content-between">
                    <Row className="w-100 m-0 pb-1">
                        <Col className="px-0 doctorBigCardName font-assistant lg-font">{doctor.fullName}</Col>
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
                                <Col className="px-0 doctorBigCardButtons" sm="auto">
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
                            <Col className="px-0 doctorBigCardButtons" sm="auto">
                                <Icon icon="fa-minus fa-sm" onClick={onClose} />
                            </Col>
                        </OverlayTrigger>
                    </Row>
                    <Row className="w-100 m-0 gap-4 py-1">
                        <Col className="p-0" sm="auto">
                            <DoctorCategoryRibbon category={doctor.category} />
                        </Col>
                        <Col className="p-0">
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
                    <Row className="w-100 m-0 gap-0 py-1 doctor-location">
                        {doctor.locations.map((location) => (
                            <Button
                                label={location?.hospitalName || ""}
                                className={
                                    location === selectedLocation ? "doctorLocationBtnSelected" : "doctorLocationBtn"
                                }
                                icon={location === selectedLocation ? "fa-hospital" : ""}
                                key={`${location?.hospitalName || location?.address}-btn`}
                                onClick={() => setSelectedLocation(location)}
                            >
                                {location.privateOnly && (
                                    <p className="doctorLocationPrivateLabel p-0 m-0">
                                        {location === selectedLocation ? "private" : "p"}
                                    </p>
                                )}
                            </Button>
                        ))}
                    </Row>
                    <Row className="w-100 m-0 gap-3 py-1 doctor-location">
                        {selectedLocation?.privateOnly}
                        <DoctorLocationAddress
                            doctorLocation={selectedLocation}
                            locationForDistanceCalculation={locationForDistanceCalculation}
                            distanceUnit={distanceUnit}
                        />
                        {selectedLocation?.website && (
                            <Button
                                variant="primary"
                                icon="fa-globe"
                                href={selectedLocation?.website}
                                target="_blank"
                                label={selectedLocation?.website}
                            />
                        )}
                        {selectedLocation?.email && (
                            <Button
                                variant="secondary"
                                icon="fa-envelope"
                                href={`emailto:${selectedLocation?.email}`}
                                target="_blank"
                                label={selectedLocation?.email}
                            />
                        )}
                        {selectedLocation?.phone && (
                            <Button
                                variant="secondary"
                                icon="fa-phone"
                                href={`tel:${selectedLocation?.phone}`}
                                label={selectedLocation?.phone}
                            />
                        )}
                    </Row>
                    <img src="images/line.png" className="py-3" width="100%" />
                    <Row className="m-0">
                        <Col className="p-0 m-0" sm="auto">
                            {doctor.avgRating && doctor.numOfReviews && (
                                <Rating averageRating={doctor.avgRating} totalReviews={doctor.numOfReviews} />
                            )}
                        </Col>

                        <Col className="p-0 m-0 d-flex justify-content-end">
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
                        <Row className="m-0">
                            <UserReviewsForm
                                userInfo={userInfo}
                                doctor={doctor}
                                addingReview={addingReview}
                                setAddingReview={setAddingReview}
                                allowAddingReview={true}
                                showOnlyEditableReviews={true}
                                showDoctorName={false}
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
