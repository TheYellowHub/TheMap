import { useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";

import useAuth from "./useAuth";
import useUser from "../hooks/auth/useUsers";
import { ResponseError } from "../hooks/useApiRequest";
import Button from "../components/utils/Button";
import LoadingWrapper from "../components/utils/LoadingWrapper";

interface DeleteAccountModalProps {
    show: boolean;
    onHide: () => void;
}

export default function DeleteAccountModal({ show, onHide } : DeleteAccountModalProps) {
    const { logout } = useAuth();
    const { deleteUser, isDeleteUserMutationLoading, isDeleteUsersMutationSuccess, isDeleteUserMutationError, deleteUserMutationError } = useUser();

    useEffect(() => {
        if (isDeleteUsersMutationSuccess) {
            logout();
            onHide();
        }
    }, [isDeleteUsersMutationSuccess]);

    return (<Modal show={show} backdrop="static" onHide={onHide} className="user-modal" centered>
        <Modal.Body>
            <Row><Col className="text-center my-2"><strong>Delete account</strong></Col></Row>
            <Row><Col className="text-center my-2">All your information is going to be permanantly deleted.<br />Are you sure you would like to delete your account?</Col></Row>
            <Row className="d-flex justify-content-center gap-3 mt-3">
                <Col className="m-0 p-0 d-flex flex-grow-0 justify-content-center">
                    <Button
                        variant="secondary"
                        label="Cancel"
                        type="button"
                        onClick={onHide}
                        className="w-max-content"
                    />
                </Col>
                <Col className="m-0 p-0 d-flex flex-grow-0 justify-content-center">
                    <Button
                        variant="primary"
                        label="Delete account"
                        type="button"
                        onClick={() => {
                            deleteUser();
                        }}
                        className="w-max-content"
                    />
                </Col>
            </Row>
            <Row>
                <LoadingWrapper
                    isLoading={isDeleteUserMutationLoading}
                    isError={isDeleteUserMutationError}
                    error={deleteUserMutationError as ResponseError}
                    loaderSize={20}
                    loaderText="Deleting account..."
                />
            </Row>
        </Modal.Body>
    </Modal>);
}
