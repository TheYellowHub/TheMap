import { Col, Row } from "react-bootstrap";
import Icon from "./Icon";

interface BackButtonProps {
    onClick: () => void;
    className?: string;
}

export default function BackButton({ onClick, className } : BackButtonProps) {
    return (<Row className={`mb-3 ${className}`}>
        <a onClick={onClick} className="a-no-decoration-line">
            <Col className="only-mobile med-dark-grey sm-font">
                <Icon icon="fa-arrow-left fa-sm" className="ps-0" />
                Back
            </Col>
        </a>
    </Row>);
}