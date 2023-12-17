import { Col, Row, Form, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
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
import SetUsernameModal from "./SetUsernameModal";

interface SingleReviewFormProps {
    originalReview: DoctorReview;
    setDeleted?: () => void;
    setId?: (id: ID) => void;
}

function SingleReviewForm({ originalReview, setDeleted, setId }: SingleReviewFormProps) {
    const [review, setReview] = useState(originalReview);

    const { user } = useAuth();
    const { userInfo } = useUser(user);
    const { 
        mutateItem, 
        mutateResult, 
        isMutateLoading, 
        isMutateSuccess, 
        isMutateError, 
        mutateError 
    } = useUserReviews(
        review.addedBy,
        review.doctor
    );

    const disabled = !reviewEditableStatuses.includes(review.status);

    type EditStatus = "DELETED" | "EDITING" | "SAVED" | "SUBMITTED";
    const [editStatus, setEditStatus] = useState<EditStatus>("EDITING");

    const formRef = useRef<HTMLFormElement>(null);

    const submitReview = (review: DoctorReview, newReviewStatue: ReviewStatus, newEditStatus: EditStatus) => {
        const inputs: NodeListOf<HTMLInputElement> | undefined = formRef.current?.querySelectorAll("input, textarea");
        inputs?.forEach((input) => input?.reportValidity());

        if (formRef?.current?.checkValidity() === true) {
            const newReview = { ...review, status: newReviewStatue };
            setReview(newReview);
            mutateItem(newReview);
            setEditStatus(newEditStatus);
        }
    };

    const currentDate = new Date();
    const currentMonthName = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();
    const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

    const CURRENT_USERNAME = "CURRENT_USERNAME";
    const NEW_USERNAME = "NEW_USERNAME";
    const ANONYMOUS = "ANONYMOUS";
    const [changingUsername, setChangingUsername] = useState(true);
    const [usernameFieldOptions, setUsernameFieldOptions] = useState([
        { value: NEW_USERNAME, label: "Public username" },
        { value: ANONYMOUS, label: "Anonymous" },
    ]);

    useEffect(() => {    
        const currentUsernameOptions = usernameFieldOptions.filter((option) => option.value === CURRENT_USERNAME);
        if (userInfo?.username && 
            (currentUsernameOptions.length == 0 
                || (currentUsernameOptions.length === 1 && currentUsernameOptions[0].value !== userInfo.username!))) {
            setUsernameFieldOptions([
                { value: CURRENT_USERNAME, label: userInfo.username! }, 
                ...usernameFieldOptions.filter((option) => option.value !== CURRENT_USERNAME)
            ]);
            setChangingUsername(false);
        }
    }, [userInfo, userInfo?.username]);

    useEffect(() => {
        const inputs = formRef.current?.querySelectorAll("input, textarea");
        inputs?.forEach((input) =>
            input.addEventListener("input", (e) => {
                (e.target as HTMLInputElement).reportValidity();
            })
        );
    }, [formRef]);

    useEffect(() => {
        if (isMutateSuccess) {
            if (review.status === "DELETED") {
                setDeleted && setDeleted();
            }
        }
    }, [isMutateSuccess]);

    useEffect(() => {
        if (isMutateSuccess) {
            const newId = mutateResult.id;
            if (newId !== review.id) {
                setId && setId(newId);
                setReview({ ...review, id: newId });
            }
        }
    }, [mutateResult]);

    const dateFields = (
        <>
            <SingleSelectFormField<DoctorReview>
                field={{
                    type: "singleSelect",
                    label: "",
                    getter: (review: DoctorReview) => getOperationMonthName(review)?.toString(),
                    setter: disabled ? undefined : (review: DoctorReview, newValue: string | undefined) => {
                        let year = getOperationYear(review);
                        if (year === undefined && newValue !== undefined) {
                            year = currentYear;
                        } else if (year !== undefined && newValue === undefined) {
                            year = undefined;
                        }
                        return setOperationMonthAndYear(review, newValue as MonthName, year);
                    },
                    options: monthNames
                        .filter((month) =>
                            getOperationYear(review) === undefined
                                ? false
                                : getOperationYear(review) === currentYear
                                ? review.pastOperation
                                    ? monthNames.indexOf(month) <= monthNames.indexOf(currentMonthName)
                                    : monthNames.indexOf(currentMonthName) <= monthNames.indexOf(month)
                                : true
                        )
                        .map((month) => {
                            return { value: month, label: month };
                        }),
                }}
                object={review}
                onChange={setReview}
                className="d-inline-block w-fit-content" // select-min-height ?
                allowEmptySelection={review.futureOperation}
            />
            <SingleSelectFormField<DoctorReview>
                field={{
                    type: "singleSelect",
                    label: "",
                    getter: (review: DoctorReview) => getOperationYear(review)?.toString(),
                    setter: disabled ? undefined : (review: DoctorReview, newValue: string | undefined) => {
                        let month = getOperationMonthName(review);
                        if (month === undefined && newValue !== undefined) {
                            month = currentMonthName;
                        } else if (month !== undefined && newValue === undefined) {
                            month = undefined;
                        }
                        return setOperationMonthAndYear(review, month, Number(newValue));
                    },
                    options: years
                        .filter((year) => (review.pastOperation ? year <= currentYear : currentYear <= year))
                        .map((year) => {
                            return { value: year.toString(), label: year.toString() };
                        }),
                }}
                object={review}
                onChange={setReview}
                className="d-inline-block w-fit-content" // select-min-height ?
                allowEmptySelection={review.futureOperation}
            />
        </>
    );

    return (
        <Form className="p-0 m-0" ref={formRef}>
            <fieldset disabled={disabled}>
                <Form.Group as={Row} className="p-0 m-0 pb-2 gap-3 d-flex flex-row align-items-center">
                    <Col className="m-0 p-0" xs={6} xl={3}>
                        <SingleSelectFormField<DoctorReview>
                            field={{
                                type: "singleSelect",
                                label: "",
                                getter: (review: DoctorReview) => {
                                    const findOption = (value: string) => {
                                        const options = usernameFieldOptions.filter((option) => option.value === value);
                                        return (0 < options.length ? options[0].label : undefined);
                                    };
                                    const currentUsernameOption = findOption(CURRENT_USERNAME);
                                    const value = (
                                        review.anonymous ? findOption(ANONYMOUS) 
                                        : !changingUsername && currentUsernameOption ? currentUsernameOption
                                        : findOption(NEW_USERNAME)
                                    );
                                    return value;
                                },
                                setter: disabled ? undefined : (review: DoctorReview, newValue: string | undefined) => {
                                    setChangingUsername(newValue === NEW_USERNAME);
                                    return { ...review, anonymous: newValue === ANONYMOUS };
                                },
                                options: usernameFieldOptions,
                            }}
                            object={review}
                            onChange={setReview}
                            className="select-no-border w-100 h-3"
                        />
                    </Col>
                    {user && <SetUsernameModal user={user} show={user !== undefined && changingUsername} onHide={() => setChangingUsername(false)}/>}
                    <Col className="m-0 p-0 d-flex flex-grow-0 justify-content-xl-end" xs={6} xl={3}>{review.status !== "DRAFT" && reviewStatusToString(review.status)}</Col>
                    <Col className="m-0 p-0 d-flex justify-content-end">
                        {
                            <StarRating
                                rating={review.rating || 0}
                                setRating={disabled ? undefined : (newRating) => setReview({ ...review, rating: newRating })}
                                color={true}
                            />
                        }
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="p-0 m-0 pb-2">
                    <InputFormField<DoctorReview>
                        field={reviewFieldsMap.get("description") as TextField<DoctorReview>}
                        object={review}
                        onChange={setReview}
                        placeHolder="Her knowledge of endometriosis...&#13;Her listening...&#13;Her explanation before procedures...&#13;Outcomes are...&#13;"
                        className="textarea"
                    />
                </Form.Group>
                <Form.Group as={Row} className="p-0 m-0 pb-2 d-flex flex-row align-items-center ">
                    <Col className="px-0 py-1 m-0 py-1 pe-2 h-2" sm={"auto"}>
                        <BooleanFormField<DoctorReview>
                            field={reviewFieldsMap.get("pastOperation") as BooleanField<DoctorReview>}
                            withLabel={true}
                            label={`This doctor operated on me${review.pastOperation ? ", in " : ""}`}
                            object={review}
                            key={`surgery1-${review.pastOperation}-${review.futureOperation}`}
                            onChange={(newReview: DoctorReview) => {
                                newReview = setOperationMonthAndYear(newReview, currentMonthName, currentYear);
                                newReview = {
                                    ...newReview,
                                    futureOperation: newReview.pastOperation ? false : newReview.futureOperation,
                                };
                                setReview(newReview);
                            }}
                            className="h-2"
                        />
                    </Col>
                    <Col className="px-0 py-1 m-0 d-flex gap-2 h-2">{review.pastOperation && dateFields}</Col>
                </Form.Group>
                {!review.pastOperation && (
                    <Form.Group as={Row} className="p-0 m-0 pb-2 d-flex flex-row align-items-center">
                        <Col className="p-0 m-0 py-1 pe-2" sm={"auto"}>
                            <BooleanFormField<DoctorReview>
                                field={reviewFieldsMap.get("futureOperation") as BooleanField<DoctorReview>}
                                withLabel={true}
                                label={`I have surgery scheduled with this doctor${
                                    review.futureOperation ? ", in " : ""
                                }`}
                                object={review}
                                key={`surgery1-${review.pastOperation}-${review.futureOperation}`}
                                onChange={(newReview: DoctorReview) => {
                                    newReview = setOperationMonthAndYear(newReview, currentMonthName, currentYear);
                                    newReview = {
                                        ...newReview,
                                        pastOperation: newReview.futureOperation ? false : newReview.pastOperation,
                                    };
                                    setReview(newReview);
                                }}
                                className="h-2"
                            />
                        </Col>
                        <Col className="p-0 m-0 d-flex gap-2">{review.futureOperation && dateFields}</Col>
                    </Form.Group>
                )}
            </fieldset>
            <Form.Group as={Row} className="p-0 m-0 pt-2 pb-3 w-100 gap-3">
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip className="tooltip">{review.id === undefined ? "Cancel" : "Delete"}</Tooltip>}
                >
                    <Col className="m-0 p-0 flex-grow-0">
                        <Button
                            label=""
                            type="button"
                            className="p-0 m-0"
                            variant="no-colors"
                            onClick={() => {
                                const originalReviewWithId = {...originalReview, id: review.id}
                                setReview(originalReviewWithId);
                                if (originalReviewWithId.id !== undefined) {
                                    submitReview(originalReviewWithId, "DELETED", "DELETED");
                                } else {
                                    setDeleted && setDeleted();
                                }
                            }}
                            disabled={review.status === "DELETED"}
                        >
                            <Icon icon="fa-close" padding={false} />
                        </Button>
                    </Col>
                </OverlayTrigger>
                <Col></Col>
                <Col className="m-0 p-0 d-flex flex-grow-0 justify-content-center">
                    <Button
                        variant="secondary"
                        label="Save for later"
                        type="button"
                        onClick={() => {
                            submitReview(review, "DRAFT", "SAVED");
                        }}
                        disabled={disabled}
                        className="w-max-content"
                    />
                </Col>
                <Col className="m-0 p-0 d-flex flex-grow-0 justify-content-center">
                    <Button
                        variant="primary"
                        label="Submit"
                        type="button"
                        onClick={() => {
                            submitReview(review, "PENDING_APPROVAL", "SUBMITTED");
                        }}
                        disabled={disabled}
                        className="w-max-content"
                    />
                </Col>
            </Form.Group>
            <LoadingWrapper
                isLoading={isMutateLoading}
                isError={isMutateError}
                error={mutateError as ResponseError}
                loaderSize={20}
                loaderText="Submitting..."
            >
                {editStatus == "SAVED" && (
                    <Row className="p-0 m-0 pb-2 w-100 gap-3">
                        <Col className="m-0 p-0">
                            <strong>Saved!</strong> Your review is saved. You can find it under{" "}
                            <a href="#/user/reviews">My Reviews</a>.
                        </Col>
                    </Row>
                )}
                {editStatus == "SUBMITTED" && (
                    <Row className="p-0 m-0 w-100 gap-3">
                        <Col className="m-0 p-0">
                            <strong>Thank you!</strong> Your review has been submitted and will be approved shortly, as
                            long as it complies with our <a href="https://www.theyellowhub.org/guidelines" target="_blank" rel="noreferrer">Community Guidelines</a>.
                        </Col>
                    </Row>
                )}
            </LoadingWrapper>
        </Form>
    );
}

export default SingleReviewForm;
