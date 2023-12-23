import { Col, Container, Row } from "react-bootstrap";

import SingleReviewForm from "./SingleReviewForm";
import { useUserReviews } from "../../hooks/doctors/useReviews";
import { UserInfo } from "../../auth/userInfo";
import { Doctor } from "../../types/doctors/doctor";
import { getNewReview, reviewEditableStatuses } from "../../types/doctors/review";
import React, { useState } from "react";
import { ID } from "../../types/utils/id";
import NoResults from "../doctors/search/NoResults";
import SingleReviewCard from "./SingleReviewCard";

interface UserReviewsFormPropsWithoutAddingOption {
    userInfo: UserInfo;
    doctor?: never;
    addingReview?: never;
    setAddingReview?: never;
    allowAddingReview?: false;
    showOnlyEditableReviews?: boolean;
    showDoctorName?: boolean;
    containerClassName?: string;
}

interface UserReviewsFormPropsWithAddingOption {
    userInfo: UserInfo;
    doctor: Doctor;
    addingReview: boolean;
    setAddingReview: (addingReview: boolean) => void;
    allowAddingReview?: true;
    showOnlyEditableReviews?: boolean;
    showDoctorName?: boolean;
    containerClassName?: string;
}

type UserReviewsFormProps = UserReviewsFormPropsWithoutAddingOption | UserReviewsFormPropsWithAddingOption;

function UserReviews({
    userInfo,
    doctor,
    addingReview,
    setAddingReview,
    allowAddingReview = false,
    showOnlyEditableReviews = false,
    showDoctorName = true,
    containerClassName = "",
}: UserReviewsFormProps) {
    const { data: userReviews } = useUserReviews(userInfo, doctor);

    const newReview = allowAddingReview && doctor && getNewReview(doctor, userInfo);
    const [newReviewId, setNewReviewId] = useState<ID>();

    return (
        <Container className={`${containerClassName}`}>
            {0 < userReviews?.length  || allowAddingReview
            ? (<Row className="m-0">
                    {allowAddingReview && newReview && addingReview && (
                        <Row key={newReview.id!} className="m-0 p-0 pt-4">
                            <SingleReviewForm
                                key={`review-${newReview.id}`}
                                originalReview={newReview}
                                onCancel={() => setAddingReview(false)}
                                setId={setNewReviewId}
                            />
                        </Row>
                    )}
                    {userReviews
                        .filter(
                            (review) =>
                                (showOnlyEditableReviews
                                    ? (review.status && (reviewEditableStatuses as unknown as string[])).includes(
                                          review.status
                                      )
                                    : (review.status !== "DELETED")) && review.id !== newReviewId
                        )
                        .sort((a, b) => ((a.id ? a.id : 0) < (b.id ? b.id : 0) ? 1 : -1))
                        .map((review) => (
                            <React.Fragment key={`review-${review.id}`}>
                                {showDoctorName && (
                                    <Row key={`review-${review.id}-doctor`} className="m-0 p-0 pt-4 pb-1">
                                        <Col className="p-0 m-0">
                                            <a href={`#/${review.doctor.id}`} className="strong">
                                                {review.doctor.fullName}
                                            </a>
                                        </Col>
                                    </Row>
                                )}
                                <Row key={`review-${review.id}`} className={`m-0 p-0 ${showDoctorName || "pt-4"}`}>
                                    <SingleReviewCard review={review} key={`review-${review.id}`} /> 
                                </Row>
                            </React.Fragment>
                        ))}
                </Row>
            )
            : <NoResults
                title="My Reviews"
                icon="fa-star" 
                subtitle="No Reviews"
                message="Review providers to help others reach the right care."
                linkTitle="Find providers now"
                linkTo="#"
                className="m-3 w-100"
            />
            }
        </Container>
    );
}

export default UserReviews;
