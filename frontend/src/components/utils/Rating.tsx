import { Col, Row } from "react-bootstrap";
import StarRating from "./StarRating";

interface RatingProps {
    averageRating: number;
    totalReviews: number;
}

function Rating({ averageRating, totalReviews }: RatingProps) {
    return (
        <Row className="d-flex flex-wrap p-0 m-0 gap-0 dark-grey star-rating">
            <Col className="d-flex flex-nowrap p-0 pe-3">
                {StarRating({ rating: averageRating })} {averageRating}
            </Col>
            <Col className="d-flex flex-nowrap text-nowrap p-0 flex-grow-0 pe-3">{totalReviews} Reviews</Col>
        </Row>
    );
}

export default Rating;
