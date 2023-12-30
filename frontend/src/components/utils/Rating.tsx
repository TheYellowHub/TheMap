import { Col, Row } from "react-bootstrap";
import StarRating from "./StarRating";
import Icon from "./Icon";

interface RatingProps {
    averageRating: number;
    totalReviews?: number;
    shorterFormat?: boolean;
}

function Rating({ averageRating, totalReviews, shorterFormat = false }: RatingProps) {
    return (
        <Row className="d-flex justify-content-center flex-nowrap p-0 m-0 gap-2 dark-grey star-rating">
            <Col className={`d-flex flex-nowrap p-0 flex-grow-0`}>
                {shorterFormat ? <Icon icon="fa-star" padding={false} solid={false} /> : <StarRating rating={averageRating} color={true} />}
            </Col>
            <Col className={`d-flex flex-nowrap p-0 flex-grow-0 md-font strong`}>
                {averageRating}
            </Col>
            {totalReviews && <Col className="d-flex flex-nowrap text-nowrap p-0 flex-grow-0 pe-3 med-dark-grey sm-font">{shorterFormat ? `/ ${totalReviews}` : `(${totalReviews} Reviews)`}</Col>}
        </Row>
    );
}

export default Rating;
