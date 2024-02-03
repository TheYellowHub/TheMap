import { Col, Row, Modal, Form } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";

import LoadingWrapper from "../utils/LoadingWrapper";
import { ResponseError } from "../../hooks/useApiRequest";
import { TextField } from "../../utils/fields";
import useUser from "../../hooks/auth/useUsers";
import { UserInfo, userInfoFieldsMap } from "../../auth/userInfo";
import { User } from "@auth0/auth0-react";
import Button from "../utils/Button";
import InputFormField from "../utils/form/inputField";
import useFormValidation from "../../hooks/useFormValidation";
import UserModal from "../utils/UserModal";

interface SetUsernameModalProps {
    user: User;
    show: boolean;
    onHide: () => void;
}

function SetUsernameModal({ user, show, onHide }: SetUsernameModalProps) {
    const { 
        userInfo: originalUserInfo, 
        mutateUsername, 
        isUsernameMutationLoading,
        isUsernameMutationSuccess,
        isUsernameMutationError,
        usernameMutationError, 
    } = useUser(user);
    
    const [userInfo, setUserInfo] = useState<UserInfo | undefined>();

    const formRef = useRef<HTMLFormElement>(null);
    const { reportValidity, isFormValid } = useFormValidation(formRef);

    useEffect(() => {
        setUserInfo({
            ...originalUserInfo, 
            username: originalUserInfo?.username ? originalUserInfo?.username : user?.nickname
        } as UserInfo);
    }, [originalUserInfo]);

    useEffect(() => {
        onHide();
    }, [isUsernameMutationSuccess]);

    return (        
        <UserModal show={show} onHide={onHide}>
            <Modal.Body>
                <Form className="p-0 m-0" ref={formRef}>
                    <Row><Col className="text-center my-2"><strong>Set a public username</strong></Col></Row>
                    <Row><Col className="text-center my-2">This will be the default name for your reviews and public comments</Col></Row>
                    <Row>
                        <Col className="d-flex justify-content-center my-3">
                            {userInfo && <InputFormField<UserInfo>
                                field={userInfoFieldsMap.get("username") as TextField<UserInfo>}
                                object={userInfo}
                                onChange={setUserInfo}
                                placeHolder="Username"
                                className="blue-border round-border w-70"
                                required={true}
                            />}
                        </Col>
                    </Row>
                    <Row className="d-flex justify-content-end gap-3 mt-3">
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
                                label="Save"
                                type="button"
                                onClick={() => {
                                    reportValidity();
                                    if (isFormValid() && userInfo?.username !== originalUserInfo?.username) {
                                        mutateUsername(userInfo!.username!);
                                    }
                                }}
                                className="w-max-content"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <LoadingWrapper
                            isLoading={isUsernameMutationLoading}
                            isError={isUsernameMutationError}
                            error={usernameMutationError as ResponseError}
                            loaderSize={20}
                            loaderText="Submitting..."
                        />
                    </Row>
                </Form>
            </Modal.Body>
        </UserModal>
    );
}

export default SetUsernameModal;
