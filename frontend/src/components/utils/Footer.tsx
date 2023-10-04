import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <Container fluid>
            <Row className="bg-light bg-body-tertiary footer">
                <Col className="text-center">
                    Copyright &copy; <Link to="https://www.theyellowhub.org/">TheYellowHub.org</Link>
                </Col>
            </Row>
        </Container>
    );
}

export default Footer;
