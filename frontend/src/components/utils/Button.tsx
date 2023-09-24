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
    href?: string;
    target?: string;
    className?: string;
}

function Button({ label, disabled, variant, type, icon, onClick, href, target, className, children }: ButtonProps) {
    return (
        <ReactButton
            className={className}
            onClick={onClick}
            href={href}
            target={target}
            variant={variant}
            type={type}
            disabled={disabled}
        >
            {label}
            {children}
            {icon && <Icon icon={icon} />}
        </ReactButton>
    );
}

export default Button;
