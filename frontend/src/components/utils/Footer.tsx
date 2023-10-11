import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Icon from "./Icon";

function Footer() {
    return (
        <Container fluid>
            <Row className="footer">
                <Col className="text-center">
                    <div className="footer-content">
                        <Icon icon="fa-copyright" solid={false} />
                        2023 <Link to="https://www.theyellowhub.org/">TheYellowHub.org</Link>
                    </div>
                    <div className="footer-content-smaller">
                        <Icon icon="fa-brands fa-github" link="https://github.com/HanaBenami" />
                        <Icon icon="fa-brands fa-linkedin" link="https://www.linkedin.com/in/hana-oliver-b9268313/" />
                        Developed by{" "}
                        <a href="mailto:hana.benami@gmail.com" target="_blank" rel="noreferrer">
                            Hana Oliver
                        </a>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Footer;
