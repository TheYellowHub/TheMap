import React from "react";
import { Modal } from "react-bootstrap";

interface UserModalProps extends React.PropsWithChildren {
    show: boolean;
    onHide: () => void;
    className?: string;
}

function UserModal({ show, onHide, className, children }: UserModalProps) {
    return (
        <Modal show={show} backdrop="static" onHide={onHide} className={`user-modal ${className}`} centered>
            {children}
        </Modal>
    );
}

export default UserModal;
