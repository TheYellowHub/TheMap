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
    const [displayFooterOnMobile, setDisplayFooterOnMobile] = useState(false);
    const [footerHeightDesktop, setFooterHeightDesktop] = useState<string>();
    const [footerHeightMobile, setFooterHeightMobile] = useState<string>();
    const mobileBreakingpointCssVariable = "--is-mobile-bp";
    const footerHeightCssVariable = "--footer-height";
    const footerHeightDesktopCssVariable = "--footer-height-desktop";
    const footerHeightMobileCssVariable = "--footer-height-mobile";

    const getRoot = () => (document.querySelector(':root')! as HTMLElement);
    const getProperty = (property: string) => getComputedStyle(getRoot()).getPropertyValue(property);
    const setProperty = (property: string, value: string) => getRoot().style.setProperty(property, value);
    const setFooterCurrentHeight = (value: string) => setProperty(footerHeightCssVariable, value);
    const zeroHeight = "0";

    const saveOriginalFooterHeight = () => {
        setFooterHeightDesktop(getProperty(footerHeightDesktopCssVariable));
        setFooterHeightMobile(getProperty(footerHeightMobileCssVariable));
    }

    const checkIfMobile = () => {
        const isMobileNow = window.innerWidth <= Number(getProperty(mobileBreakingpointCssVariable));
        setIsMobile(isMobileNow);
    }

    useEffect(() => {
        saveOriginalFooterHeight();
        checkIfMobile();
        window.addEventListener("resize", checkIfMobile, false);
    }, []);

    useEffect(() => {
        if (isMobile) {
            setFooterCurrentHeight(zeroHeight);
            setDisplayFooterOnMobile(false);
        } else {
            setFooterCurrentHeight(footerHeightDesktop!);
        }
    }, [isMobile]);

    useEffect(() => {
        if (scrollDir === "down") {
            setDisplayFooterOnMobile(true);
            setFooterCurrentHeight(footerHeightMobile!);
        } else if (scrollDir === "up") {
            setDisplayFooterOnMobile(false);
            setFooterCurrentHeight(zeroHeight!);
        }
    }, [scrollDir]);

    const tyhDiv = (<div className="footer-content">
        <Icon icon="fa-copyright" solid={false} />
        2023 <Link to="https://www.theyellowhub.org/">TheYellowHub.org</Link>
    </div>);

    const developerDiv = (<div className="footer-content-smaller">
        <Icon icon="fa-brands fa-github" className="my-0 py-0" link="https://github.com/HanaBenami" />
        <Icon icon="fa-brands fa-linkedin" className="my-0 py-0" link="https://www.linkedin.com/in/hana-oliver-b9268313/" />
        Developed by{" "}
        <a href="mailto:hana.benami@gmail.com" target="_blank" rel="noreferrer">
            Hana Oliver
        </a>
    </div>)

    return (
        <Container fluid>
            <Row className={`footer only-desktop`}>
                <Col className="only-desktop">
                    {tyhDiv}
                </Col>
                <Col className="only-desktop d-flex justify-content-end">
                    {developerDiv}
                </Col>
            </Row>
            <Row className={`footer ${displayFooterOnMobile ? "only-mobile" : "d-none"}`}>
                <Col className="text-center only-mobile">
                    {tyhDiv}
                    {developerDiv}
                </Col>
            </Row>
        </Container>
    );
}

export default Footer;
