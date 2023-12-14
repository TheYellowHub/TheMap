import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import useDetectScroll, {
    Axis,
    Direction
} from '@smakss/react-scroll-direction'; 

import Icon from "./Icon";
import { useEffect, useState } from "react";

function Footer() {
    const scrollDir = useDetectScroll();
    const [isMobile, setIsMobile] = useState(false);
    const [displayFooter, setDisplayFooter] = useState(false);
    const [originalFooterHeight, setOriginalFooterHeight] = useState<string>();
    const mobileCssVariable = "--is-mobile";
    const footerHeightCssVariable = "--footer-height";

    const getRoot = () => (document.querySelector(':root')! as HTMLElement);
    const getProperty = (property: string) => getComputedStyle(getRoot()).getPropertyValue(property);
    const setProperty = (property: string, value: string) => getRoot().style.setProperty(property, value);
    const setFooterCurrentHeight = (value: string) => setProperty(footerHeightCssVariable, value);
    const zeroHeight = "0";

    const saveOriginalFooterHeight = () => {
        const footerOriginalHeight = getProperty(footerHeightCssVariable);
        if (footerOriginalHeight !== zeroHeight) {
            setOriginalFooterHeight(footerOriginalHeight);
        }
    }

    const checkIfMobile = () => {
        const isMobile = getProperty(mobileCssVariable) === "true";
        setIsMobile(isMobile);
        if (isMobile) {
            setFooterCurrentHeight(zeroHeight);
        } else if (originalFooterHeight && originalFooterHeight !== zeroHeight) {
            setFooterCurrentHeight(originalFooterHeight);
        }
    }

    useEffect(() => {
        saveOriginalFooterHeight();
        checkIfMobile();
        window.addEventListener("resize", checkIfMobile, false);
    }, []);

    useEffect(() => {
        if (isMobile && scrollDir !== "still") {
            const displayFooter = scrollDir === "down";
            setDisplayFooter(displayFooter);
            setFooterCurrentHeight(
                originalFooterHeight && displayFooter ? originalFooterHeight : zeroHeight
            );
        }
    }, [scrollDir, originalFooterHeight, isMobile])

    return (
        <Container fluid>
            <Row className={`footer ${displayFooter ? "" : "only-desktop"}`}>
                <Col className="text-center">
                    <div className="footer-content">
                        <Icon icon="fa-copyright" solid={false} />
                        2023 <Link to="https://www.theyellowhub.org/">TheYellowHub.org</Link>
                    </div>
                    <div className="footer-content-smaller">
                        <Icon icon="fa-brands fa-github" className="my-0 py-0" link="https://github.com/HanaBenami" />
                        <Icon icon="fa-brands fa-linkedin" className="my-0 py-0" link="https://www.linkedin.com/in/hana-oliver-b9268313/" />
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
