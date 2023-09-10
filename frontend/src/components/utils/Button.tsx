import { Button as ReactButton } from "react-bootstrap";
import { Variant } from "react-bootstrap/esm/types";

import Icon from "./Icon";

interface ButtonProps extends React.PropsWithChildren {
    label: string;
    disabled?: boolean;
    variant?: Variant;
    icon?: string;
    onClick?: React.MouseEventHandler;
}

function Button({ label, disabled, variant, icon, onClick, children }: ButtonProps) {
    return (
        <ReactButton onClick={onClick} variant={variant} disabled={disabled}>
            {label}
            {children}
            {icon && <Icon icon={icon} />}
        </ReactButton>
    );
}

export default Button;
