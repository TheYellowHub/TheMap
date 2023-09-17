import { Button as ReactButton } from "react-bootstrap";
import { Variant } from "react-bootstrap/esm/types";

import Icon from "./Icon";

interface ButtonProps extends React.PropsWithChildren {
    label: string;
    disabled?: boolean;
    variant?: Variant;
    type?: "button" | "submit" | "reset";
    icon?: string;
    onClick?: React.MouseEventHandler;
}

function Button({ label, disabled, variant, type, icon, onClick, children }: ButtonProps) {
    return (
        <ReactButton onClick={onClick} variant={variant} type={type} disabled={disabled}>
            {label}
            {children}
            {icon && <Icon icon={icon} />}
        </ReactButton>
    );
}

export default Button;
