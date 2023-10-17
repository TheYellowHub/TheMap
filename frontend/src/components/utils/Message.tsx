import React from "react";
import { Alert } from "react-bootstrap";
import type { Variant } from "react-bootstrap/esm/types";

interface MessageProps extends React.PropsWithChildren {
    variant: Variant;
    className?: string;
}

function Message({ variant, className, children }: MessageProps) {
    return (
        <Alert variant={variant} className={className}>
            {children}
        </Alert>
    );
}

export default Message;
