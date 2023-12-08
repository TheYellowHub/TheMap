import { Col, Container, Row } from "react-bootstrap";

import SingleReviewForm from "./SingleReviewForm";
import { useUserReviews } from "../../hooks/doctors/useReviews";
import { UserInfo } from "../../auth/userInfo";
import { Doctor } from "../../types/doctors/doctor";
import { getNewReview, reviewEditableStatuses } from "../../types/doctors/review";
import { useState } from "react";
import { ID } from "../../types/utils/id";

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

function UserReviewsForm({
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
            {userReviews && (
                <Row className="m-0">
                    {allowAddingReview && newReview && addingReview && (
                        <Row key={newReview.id!} className="m-0 p-0 pt-4">
                            <SingleReviewForm
                                key={`review-${newReview.id}`}
                                originalReview={newReview}
                                setDeleted={() => setAddingReview(false)}
                                setId={setNewReviewId}
                            />
                        </Row>
                    )}
                    {userReviews
                        .filter(
                            (review) =>
                                (showOnlyEditableReviews
                                    ? (review.status && (reviewEditableStatuses as any as string[])).includes(
                                          review.status
                                      )
                                    : true) && review.id !== newReviewId
                        )
                        .sort((a, b) => ((a.id ? a.id : 0) < (b.id ? b.id : 0) ? 1 : -1))
                        .map((review) => (
                            <>
                                {showDoctorName && (
                                    <Row key={`review-${review.id}-doctor`} className="m-0 p-0 pt-4">
                                        <Col className="p-0 m-0">
                                            <a href={`#/${review.doctor.id}`} className="strong">
                                                {review.doctor.fullName}
                                            </a>
                                        </Col>
                                    </Row>
                                )}
                                <Row key={`review-${review.id}`} className={`m-0 p-0 ${showDoctorName || "pt-4"}`}>
                                    <SingleReviewForm key={`review-${review.id}`} originalReview={review} />
                                </Row>
                            </>
                        ))}
                </Row>
            )}
        </Container>
    );
}

export default UserReviewsForm;
