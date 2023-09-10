import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer>
            <Container fluid>
                <Row className="bg-light bg-body-tertiary">
                    <Col className="text-center">
                        Copyright &copy;{" "}
                        <Link to="https://www.theyellowhub.org/">TheYellowHub.org</Link>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;
