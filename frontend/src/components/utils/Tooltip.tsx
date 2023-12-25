import { ReactElement } from "react";
import { OverlayTrigger, Tooltip as ReactTooltip } from "react-bootstrap";

interface TooltipProps {
    text: string;
    children: ReactElement;
}

export default function Tooltip({ text, children }: TooltipProps) {
    return (
        <OverlayTrigger placement="top" overlay={<ReactTooltip className="tooltip">{text}</ReactTooltip>}>
            {children}
        </OverlayTrigger>
    );
}
