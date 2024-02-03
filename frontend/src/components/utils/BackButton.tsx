import { Col, Row } from "react-bootstrap";
import Icon from "./Icon";

interface BackButtonProps {
    className?: string;
}

export default function BackButton({ className } : BackButtonProps) {
    return (<Row className={`m-0 ${!className?.includes("mb-") && "mb-3"} ${className}`}>
        <a onClick={() => history.back()} className="p-0 a-no-decoration-line">
            <Col className="only-mobile-and-tablets med-dark-grey sm-font flex-grow-0">
                <Icon icon="fa-arrow-left fa-sm" className="ps-0" />
                Back
            </Col>
        </a>
    </Row>);
}