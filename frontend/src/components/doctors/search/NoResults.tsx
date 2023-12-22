import { Col, Container, Row } from "react-bootstrap";

import Icon from "../../utils/Icon";

interface NoResultsProps {
    title?: string;
    icon?: string;
    subtitle?: string;
    message?: string;
    linkTitle?: string;
    linkTo?: string;
    onClick?: () => void;
    className?: string;
}

export default function NoResults({
    title,
    icon,
    subtitle,
    message,
    linkTitle,
    linkTo,
    onClick,
    className
}: NoResultsProps) {
    return (
        <Container className={`${className} mt-3 h-main`}>
            {title && <Row className="xl-font w-700">{title}</Row>}
            <Row className="d-flex my-4 align-content-around text-center h-100">
                <Row></Row>
                {(icon || subtitle) && <Container>
                    {icon && <Row className="pb-4"><Col><Icon icon={`${icon} huge-icon`}/></Col></Row>}
                    {subtitle && <Row><Col className="med-dark-grey">{subtitle}</Col></Row>}
                </Container>}
                {(message || linkTitle) && <Container className="w-70">
                    {message && <Row><Col>{message}</Col></Row>}
                    {linkTitle && <Row><Col><a className="a-only-hover-decoration text-decoration-underline" href={linkTo} onClick={onClick}>{linkTitle}</a></Col></Row>}
                </Container>}
                <Row></Row>
            </Row>
        </Container>
    );
}
