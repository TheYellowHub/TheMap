import { Col, Row } from "react-bootstrap";
import StarRating from "./StarRating";

interface RatingProps {
    averageRating: number;
    totalReviews: number;
    shorterFormat?: boolean;
}

function Rating({ averageRating, totalReviews, shorterFormat = false }: RatingProps) {
    return (
        <Row className="d-flex flex-wrap p-0 m-0 gap-0 dark-grey star-rating">
            <Col className={`d-flex flex-nowrap ps-0 pe-2 flex-grow-0`}>
                {StarRating({ rating: averageRating })}
            </Col>
            <Col className={`d-flex flex-nowrap ps-0 ${shorterFormat ? "flex-grow-0 pe-2" : "pe-4"}`}>
                {averageRating}
            </Col>
            <Col className="d-flex flex-nowrap text-nowrap p-0 flex-grow-0 pe-3 med-dark-grey">{shorterFormat ? `/ ${totalReviews}` : `${totalReviews} Reviews`}</Col>
        </Row>
    );
}

export default Rating;
