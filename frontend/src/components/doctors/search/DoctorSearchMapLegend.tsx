import { Col, Container, Row } from "react-bootstrap";

import { getMarkerIconDir, getMarkerIconUrl, markerIcons } from "../../map/markerIcon";
import Icon from "../../utils/Icon";
import { Marker } from "../../map/GoogleMap";

interface DoctorSearchMapLegendProps {
    markers: Marker[];
    onClick: () => void;
}

export default function DoctorSearchMapLegend({ markers, onClick }: DoctorSearchMapLegendProps) {
    const dir = getMarkerIconDir(false, false);
    const iconsInUse = new Set(markers.map((marker) => marker.icon?.substring(marker.icon.lastIndexOf("/") + 1, marker.icon.lastIndexOf("."))));
    const legendItems = iconsInUse && markerIcons
        .filter((markerIcon) => iconsInUse.has(markerIcon.imgFileName))
        .sort((a, b) => (b.order === undefined || (a.order && b.order && a.order < b.order) ? -1 : 1 ))
        .map(markerIcon => (
            <Row key={markerIcon.title} className="flex-nowrap">
                <Col><img src={getMarkerIconUrl(dir, markerIcon.imgFileName)} height={"30px"} /> </Col>
                <Col className="d-flex text-nowrap align-items-center sm-font">{markerIcon.title}</Col>
            </Row>
    ));   

    return (<Container className="gm-control-active-copy w-fit-content d-flex p-2">
        <Row className="d-flex flex-nowrap">
            <Col className="d-flex flex-column gap-1">
                {legendItems}
            </Col>
            <Col className="d-flex align-items-top">
                <Icon icon="fa-close" className="ps-0" onClick={onClick} />
            </Col>
        </Row>
    </Container>);
}
