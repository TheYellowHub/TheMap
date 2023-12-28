import { Container, Row, Col, Spinner } from "react-bootstrap";

interface LoaderProps {
    size?: number;
    text?: string;
    center?: boolean;
    fullHeight?: boolean;
    className?: string;
    marginTop?: boolean;
}

function Loader({ size = 100, text = "Loading...", center = false, fullHeight = true, className = "", marginTop = true }: LoaderProps) {
    return (
        <>
            <Container className={`d-flex align-items-center ${marginTop ? "mt-3" : ""} ${center ? "justify-content-center " + (fullHeight ? "h-main" : "") : ""} ${className}`}>
                <Row className="gap-3">
                    <Col xs="auto">
                        <Spinner
                            animation="border"
                            style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                display: "block",
                            }}
                        />
                    </Col>
                    <Col className="d-flex align-items-center">
                        <h5>{text}</h5>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Loader;
