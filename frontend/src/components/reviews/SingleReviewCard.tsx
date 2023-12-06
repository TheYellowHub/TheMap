import { Container, Col, Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ReactElement } from "react";

import { DoctorReview, getOperationMonthAndYear } from "../../types/doctors/review";
import StarRating from "../utils/StarRating";
import ExpandableText from "../utils/ExpandableText";
import Icon from "../utils/Icon";

interface ReviewProps {
    review: DoctorReview;
}

function SingleReviewCard({ review }: ReviewProps) {
    const surgeryElementWrapper = (element: ReactElement) =>
        review.operationMonth ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Surgery {getOperationMonthAndYear(review)}</Tooltip>}>
                {element}
            </OverlayTrigger>
        ) : (
            <>{element}</>
        );

    return (
        <Container className="p-0 m-0">
            <Row className="d-flex p-0 m-0 pb-2 align-items-center flex-nowrap">
                <Col className="m-0 p-0 flex-grow-0 flex-shrink-2 text-break" xs={7}>
                    <strong>{review.anonymous ? "Anonymous" : review.addedBy.remoteId}</strong>
                </Col>
                {review.pastOperation || review.futureOperation ? (
                    surgeryElementWrapper(
                        <Col className="m-0 p-0 flex-grow-0" xs={2}>
                            <Icon icon="fa-scalpel" />
                        </Col>
                    )
                ) : (
                    <Col xs={2}></Col>
                )}
                <Col className="m-0 p-0 d-flex justify-content-end" xs={3}>
                    {review.rating && <StarRating rating={review.rating} color={true} />}
                </Col>
            </Row>
            <Row className="p-0 m-0">
                <ExpandableText text={review.description || ""} initialLength={300} className="med-dark-grey" />
            </Row>
        </Container>
    );
}

export default SingleReviewCard;
