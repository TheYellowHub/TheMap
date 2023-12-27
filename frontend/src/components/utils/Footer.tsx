import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import useDetectScroll from "@smakss/react-scroll-direction"; 

import Icon from "./Icon";
import { useEffect, useState } from "react";
import { MAP_CONTAINER_ID as mapContainerId } from "../../screens/MapScreen";
import { getProperty, setProperty } from "../../utils/css";

export const footerHeightCssVariable = "--footer-height";

function Footer() {
    const scrollDir = useDetectScroll();
    const [isMobile, setIsMobile] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [displayFooterOnMobile, setDisplayFooterOnMobile] = useState(false);
    const [footerHeightDesktop, setFooterHeightDesktop] = useState<string>();
    const [footerHeightMobile, setFooterHeightMobile] = useState<string>();
    const mobileBreakingpointCssVariable = "--is-mobile-bp";
    const footerHeightDesktopCssVariable = "--footer-height-desktop";
    const footerHeightMobileCssVariable = "--footer-height-mobile";

    const setFooterCurrentHeight = (value: string) => setProperty(footerHeightCssVariable, value);
    const zeroHeight = "0";

    const saveOriginalFooterHeight = () => {
        setFooterHeightDesktop(getProperty(footerHeightDesktopCssVariable));
        setFooterHeightMobile(getProperty(footerHeightMobileCssVariable));
    };

    const checkIfMobile = () => {
        const isMobileNow = window.innerWidth <= Number(getProperty(mobileBreakingpointCssVariable));
        setIsMobile(isMobileNow);
    };

    const mapResizeObserver = new ResizeObserver((entries) => setIsMapOpen(entries[0].contentRect.height !== 0));

    useEffect(() => {
        saveOriginalFooterHeight();
        checkIfMobile();
        window.addEventListener("resize", checkIfMobile, false);
    }, []);

    useEffect(() => {
        const mapElement = document.getElementById(mapContainerId);
        if (mapElement) {
            mapResizeObserver.observe(mapElement);
        }
    });

    useEffect(() => {
        if (isMobile) {
            setFooterCurrentHeight(zeroHeight);
            setDisplayFooterOnMobile(false);
        } else {
            setFooterCurrentHeight(footerHeightDesktop!);
        }
    }, [isMobile]);

    useEffect(() => {
        if (isMobile && isMapOpen) {
            setFooterCurrentHeight(zeroHeight);
            setDisplayFooterOnMobile(false);
        }
    }, [isMapOpen]);

    useEffect(() => {
        if (scrollDir === "down" && !isMapOpen) {
            setDisplayFooterOnMobile(true);
            setFooterCurrentHeight(footerHeightMobile!);
        } else if (scrollDir === "up") {
            setDisplayFooterOnMobile(false);
            setFooterCurrentHeight(zeroHeight!);
        }
    }, [scrollDir]);

    const tyhDiv = (<div className="footer-content">
        <Icon icon="fa-copyright" solid={false} />
        2024 Community-sourced by <Link to="https://www.theyellowhub.org/">TheYellowHub.org</Link>
    </div>);

    const developerDiv = (<div className="footer-content-smaller">
        <Icon icon="fa-brands fa-github" className="my-0 py-0" link="https://github.com/HanaBenami" />
        <Icon icon="fa-brands fa-linkedin" className="my-0 py-0" link="https://www.linkedin.com/in/hana-oliver-b9268313/" />
        Developed by{" "}
        <a href="mailto:hana.benami@gmail.com" target="_blank" rel="noreferrer">
            Hana Oliver
        </a>
    </div>);

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
