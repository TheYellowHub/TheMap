import { Col, Row, Form, OverlayTrigger, Tooltip, Modal, Container } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";

import {
    DoctorReview,
    ReviewStatus,
    reviewFieldsMap,
    getOperationMonthName,
    getOperationYear,
    setOperationMonthAndYear,
    reviewStatusToString,
    reviewEditableStatuses,
} from "../../types/doctors/review";
import { useUserReviews } from "../../hooks/doctors/useReviews";
import LoadingWrapper from "../utils/LoadingWrapper";
import { ResponseError } from "../../hooks/useApiRequest";
import Icon from "../utils/Icon";
import Button from "../utils/Button";
import StarRating from "../utils/StarRating";
import InputFormField from "../utils/form/inputField";
import SingleSelectFormField from "../utils/form/singleSelectField";
import BooleanFormField from "../utils/form/booleanField";
import { BooleanField, TextField } from "../../utils/fields";
import { MonthName, monthNames } from "../../types/utils/dateTime";
import { ID } from "../../types/utils/id";
import useUser from "../../hooks/auth/useUsers";
import useAuth from "../../auth/useAuth";
import { UserInfo, userInfoFieldsMap } from "../../auth/userInfo";
import { User } from "@auth0/auth0-react";

interface SingleReviewFormProps {
    user: User;
    show: boolean;
    onHide: () => void;
}

function SetUsernameModal({ user, show, onHide }: SingleReviewFormProps) {
    const { 
        userInfo: originalUserInfo, 
        mutateUsername, 
        isUsernameMutationLoading,
        isUsernameMutationSuccess,
        isUsernameMutationError,
        usernameMutationError, 
    } = useUser(user);
    
    const [userInfo, setUserInfo] = useState<UserInfo | undefined>();

    useEffect(() => {
        setUserInfo({
            ...originalUserInfo, 
            username: originalUserInfo?.username ? originalUserInfo?.username : user?.nickname
        } as UserInfo);
    }, [originalUserInfo]);

    useEffect(() => {
        onHide();
    }, [isUsernameMutationSuccess])

    return (        
        <Modal show={show} backdrop="static" onHide={onHide} className="user-modal" centered>
                <Modal.Body>
                    <Row><Col className="text-center my-2"><strong>Set a public username</strong></Col></Row>
                    <Row><Col className="text-center my-2">This will be the default name for your reviews and public comments</Col></Row>
                    <Row>
                        <Col className="d-flex justify-content-center my-3">
                            {userInfo && <InputFormField<UserInfo>
                                field={userInfoFieldsMap.get("username") as TextField<UserInfo>}
                                object={userInfo}
                                onChange={setUserInfo}
                                placeHolder="Username"
                                className="blue-border w-70"
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
                                    if (userInfo?.username !== originalUserInfo?.username) {
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
                </Modal.Body>
        </Modal>
    );
}

export default SetUsernameModal;
