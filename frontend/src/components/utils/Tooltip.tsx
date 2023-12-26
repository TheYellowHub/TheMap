import { ReactElement } from "react";
import { OverlayTrigger, Tooltip as ReactTooltip } from "react-bootstrap";

interface TooltipProps {
    text: string;
    className?: string;
    children: ReactElement;
}

export default function Tooltip({ text, className = "", children }: TooltipProps) {
    return (
        <OverlayTrigger placement="top" overlay={<ReactTooltip className={`tooltip ${className}`}>{text}</ReactTooltip>}>
            {children}
        </OverlayTrigger>
    );
}
