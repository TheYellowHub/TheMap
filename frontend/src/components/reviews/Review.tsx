import { Container, Col, Row } from "react-bootstrap";

import { DoctorReview } from "../../types/doctors/review";
import StarRating from "../doctors/doctors/StarRating";
import ExpandableText from "../utils/ExpandableText";

interface ReviewProps {
    review: DoctorReview;
}

function Review({ review }: ReviewProps) {
    return (
        <Container className="p-0 m-0">
            <Row className="p-0 m-0 pb-2">
                <Col className="m-0 p-0">
                    <strong>{review.addedBy?.remoteId}</strong>
                </Col>
                {/* TODO: surgery icon */}
                <Col className="m-0 p-0" sm="auto">
                    {review.rating && <StarRating rating={review.rating} color={true} />}
                </Col>
            </Row>
            <Row className="p-0 m-0">
                <ExpandableText text={review.description || ""} initialLength={300} />
            </Row>
        </Container>
    );
}

export default Review;
