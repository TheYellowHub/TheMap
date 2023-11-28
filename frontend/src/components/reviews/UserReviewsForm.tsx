import { Container, Row } from "react-bootstrap";

import SingleReviewForm from "./SingleReviewForm";
import { useUserReviews } from "../../hooks/doctors/useReviews";
import { UserInfo } from "../../auth/userInfo";
import { Doctor } from "../../types/doctors/doctor";
import { getNewReview, reviewEditableStatuses } from "../../types/doctors/review";

interface UserReviewsFormProps {
    userInfo: UserInfo;
    doctor: Doctor;
    addingReview: boolean;
    setAddingReview: (addingReview: boolean) => void;
}

function UserReviewsForm({ userInfo, doctor, addingReview, setAddingReview }: UserReviewsFormProps) {
    const { data: userReviews } = useUserReviews(userInfo, doctor)();

    const newReview = getNewReview(doctor, userInfo);

    return (
        <Container className="p-0 m-0">
            {userReviews && (
                <Row className="m-0">
                    {addingReview && (
                        <Row key={newReview.id!} className="m-0 p-0 pt-4">
                            <SingleReviewForm
                                key={`review-${newReview.id}`}
                                originalReview={newReview}
                                setDeleted={() => setAddingReview(false)}
                                setSaved={() => setAddingReview(false)}
                            />
                        </Row>
                    )}
                    {userReviews
                        .filter(
                            (review) =>
                                review.status && (reviewEditableStatuses as any as string[]).includes(review.status)
                        )
                        .map((review) => (
                            <Row key={`review-${review.id}`} className="m-0 p-0 pt-4">
                                <SingleReviewForm key={`review-${review.id}`} originalReview={review} />
                            </Row>
                        ))}
                </Row>
            )}
        </Container>
    );
}

export default UserReviewsForm;
