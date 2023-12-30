import { Fragment } from "react";
import { Col, Container, Row } from "react-bootstrap";

import { getMarkerIconDir, getMarkerIconUrl, markerIcons } from "../../map/markerIcon"
import Icon from "../../utils/Icon";

interface DoctorSearchMapLegendProps {
    onClick: () => void;
}

export default function DoctorSearchMapLegend({ onClick }: DoctorSearchMapLegendProps) {
    const dir = getMarkerIconDir(false, false);
    const legendItems = markerIcons.map(markerIcon => (
        <Row key={markerIcon.title} className="flex-nowrap">
            <Col><img src={getMarkerIconUrl(dir, markerIcon.imgFileName)} height={"30px"} /> </Col>
            <Col className="d-flex text-nowrap align-items-center sm-font">{markerIcon.title}</Col>
        </Row>
    ));

    return <Container className="gm-control-active-copy w-fit-content d-flex p-2">
        <Row>
            <Col className="d-flex flex-column gap-1">
                {legendItems}
            </Col>
            <Col>
                <Icon icon="fa-close"onClick={onClick} />
            </Col>
        </Row>
    </Container>
}
