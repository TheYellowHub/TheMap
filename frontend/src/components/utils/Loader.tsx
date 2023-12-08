import { Container, Row, Col, Spinner } from "react-bootstrap";

interface LoaderProps {
    size?: number;
    text?: string;
}

function Loader({ size = 100, text = "Loading..." }: LoaderProps) {
    return (
        <>
            <Container className="d-flex align-items-center mt-3">
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
