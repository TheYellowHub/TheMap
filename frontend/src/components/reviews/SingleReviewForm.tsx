import { Col, Row, Form } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";

import {
    DoctorReview,
    ReviewStatus,
    reviewFieldsMap,
    getOperationMonthName,
    getOperationYear,
    setOperationMonthAndYear,
    reviewEditableStatuses,
} from "../../types/doctors/review";
import { useReviews } from "../../hooks/doctors/useReviews";
import LoadingWrapper from "../utils/LoadingWrapper";
import { ResponseError } from "../../hooks/useApiRequest";
import Icon from "../utils/Icon";
import Button from "../utils/Button";
import StarRating from "../utils/StarRating";
import InputFormField from "../utils/form/inputField";
import SingleSelectFormField from "../utils/form/singleSelectField";
import BooleanFormField from "../utils/form/booleanField";
import { BooleanField, NumberField, TextField } from "../../utils/fields";
import { MonthName, monthNames } from "../../types/utils/dateTime";
import { ID } from "../../types/utils/id";
import useUser from "../../hooks/auth/useUsers";
import useAuth from "../../auth/useAuth";
import SetUsernameModal from "./SetUsernameModal";
import useFormValidation from "../../hooks/useFormValidation";
import Tooltip from "../utils/Tooltip";
import { range } from "../../utils/utils";
import { logEvent } from "../../utils/log";

interface SingleReviewFormProps {
    originalReview: DoctorReview;
    onCancel: () => void;
    onSuccess?: () => void;
    setId?: (id: ID) => void;
}

export const getGuidelinesLink = (text = "Community Guidelines", className = "strong") => <a href="https://www.theyellowhub.org/guidelines" className={className} target="_blank" rel="noreferrer">{text}</a>;

function SingleReviewForm({ originalReview, onCancel, onSuccess, setId }: SingleReviewFormProps) {
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
    } = useReviews();

    const disabled = !reviewEditableStatuses.includes(review.status);

    type EditStatus = "EDITING" | "SAVED" | "SUBMITTED";
    const [editStatus, setEditStatus] = useState<EditStatus>("EDITING");

    const formRef = useRef<HTMLFormElement>(null);
    const { reportValidity, isFormValid } = useFormValidation(formRef);

    const submitReview = (review: DoctorReview, newReviewStatus: ReviewStatus, newEditStatus: EditStatus) => {
        reportValidity();

        if (isFormValid() === true) {
            const from = review.id ? review.status : "NEW";
            const to = newReviewStatus;
            logEvent(`Submitting review - ${from} -> ${to}`, "Reviews");

            const newReview = { ...review, status: newReviewStatus };
            setReview(newReview);
            mutateItem(newReview);
            setEditStatus(newEditStatus);
        }
    };

    const currentDate = new Date();
    const currentMonthName = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();
    const years = range(currentYear - 15,  currentYear + 2);

    const CURRENT_USERNAME = "CURRENT_USERNAME";
    const NEW_USERNAME = "NEW_USERNAME";
    const ANONYMOUS = "ANONYMOUS";
    const [changingUsername, setChangingUsername] = useState(true);
    const [usernameFieldOptions, setUsernameFieldOptions] = useState([
        { value: NEW_USERNAME, label: "Public username" },
        { value: ANONYMOUS, label: "Anonymous" },
    ]);

    const hisOrHer = review.doctor.gender === "F" ? "Her" : "His";
    const myReviewsLink = <a href="/user/reviews" onClick={onCancel} className="strong">My Reviews</a>;
    const guidelinesLink = getGuidelinesLink();

    useEffect(() => {    
        const currentUsernameOptions = usernameFieldOptions.filter((option) => option.value === CURRENT_USERNAME);
        if (userInfo?.username) { 
                if (currentUsernameOptions.length == 0 
                    || (currentUsernameOptions.length === 1 && currentUsernameOptions[0].value !== userInfo.username!)) {
                setUsernameFieldOptions([
                    { value: CURRENT_USERNAME, label: userInfo.username! }, 
                    { value: NEW_USERNAME, label: "Edit public username" },
                    { value: ANONYMOUS, label: "Anonymous" },
                ]);
                setChangingUsername(false);

            }
        } else {
            if (!review?.anonymous) {
                setChangingUsername(true);
            }
        }
    }, [userInfo, userInfo?.username]);

    useEffect(() => {    
        if (!changingUsername) {
            if (!review.anonymous && !userInfo?.username) {
                setReview({...review, anonymous: true});
            } else if (review.anonymous && userInfo?.username) {
                setReview({...review, anonymous: false});
            }
        }
    }, [changingUsername]);

    useEffect(() => {
        if (isMutateSuccess) {
            const newId = mutateResult.id;
            if (newId !== review.id) {
                setId && setId(newId);
                setReview({ ...review, id: newId });
            }
            onSuccess && onSuccess();
        }
    }, [mutateResult]);

    const dateFields = (
        <>
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
                        .sort((a, b) => review.pastOperation ? b - a : a - b)
                        .map((year) => {
                            return { value: year.toString(), label: year.toString() };
                        }),
                }}
                object={review}
                onChange={setReview}
                className="d-inline-block"
                allowEmptySelection={review.futureOperation}
            />
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
                    options: monthNames.map((month) => {
                        return { 
                            value: month, 
                            label: month,
                            disabled: (
                                getOperationYear(review) === undefined
                                ? true
                                : getOperationYear(review) === currentYear
                                    ? review.futureOperation
                                        ? monthNames.indexOf(month) <= monthNames.indexOf(currentMonthName)
                                        : monthNames.indexOf(currentMonthName) <= monthNames.indexOf(month)
                                    : false
                            ) 
                        };
                    }),
                }}
                object={review}
                onChange={setReview}
                className="d-inline-block"
                allowEmptySelection={false}
            />
        </>
    );

    return (<>
        {user && <SetUsernameModal user={user} show={user !== undefined && changingUsername} onHide={() => {
            setChangingUsername(false);
            if (!userInfo?.username) {
                setReview({...review, anonymous: true});
            }
        }}/>}

        {editStatus === "SAVED" && isMutateSuccess
        ? (
            <Row className="p-0 m-0 pb-2 w-100 gap-3 text-center">
                <Col className="m-0 p-0">
                    <div className="pb-3 strong">Saved!</div>
                    Your review is saved. 
                    <br />You can find it under {myReviewsLink}.
                </Col>
            </Row>
        )
        : editStatus === "SUBMITTED" && isMutateSuccess
        ? (
            <Row className="p-0 m-0 w-100 gap-3 text-center">
                <Col className="m-0 p-0">
                    <div className="pb-3 strong">Thank you!</div>
                    Your review has been submitted and will be approved shortly, 
                    <br />as long as it complies with our {guidelinesLink}.
                    <br />You can find it under {myReviewsLink}
                </Col>
            </Row>
        )
        : (<Form className="p-0 m-0" ref={formRef}>
            <fieldset disabled={disabled}>
                <Form.Group as={Row} className="p-0 m-0 pb-2 gap-3 d-flex flex-row flex-nowrap align-items-center">
                    <Col className="m-0 p-0" xs={4} xl={3}>
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
                            className="select-no-border h-2"
                        />
                    </Col>
                    <Col className="m-0 p-0 d-flex justify-content-end">
                        <InputFormField<DoctorReview>
                            field={reviewFieldsMap.get("rating") as NumberField<DoctorReview>}
                            object={review}
                            onChange={setReview}
                            className="dummy-input"
                        />
                        <StarRating
                            rating={review.rating || 0}
                            setRating={disabled ? undefined : (newRating) => setReview({ ...review, rating: newRating })}
                            color={true}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="p-0 m-0 pb-2">
                    <InputFormField<DoctorReview>
                        field={reviewFieldsMap.get("description") as TextField<DoctorReview>}
                        object={review}
                        onChange={setReview}
                        placeHolder={`${hisOrHer} knowledge of endometriosis...\n${hisOrHer} listening...\n${hisOrHer} explanation before procedures...\nOutcomes are...\n`}
                        className="textarea"
                    />
                </Form.Group>
                <Form.Group as={Row} className="p-0 m-0 pb-2 d-flex flex-row align-items-center row-gap-2">
                    <Col className="px-0 py-1 m-0 pe-2 h-2"  xs={11} xl={"auto"}>
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
                    <Col className="p-0 m-0 d-flex gap-2 h-2">{review.pastOperation && dateFields}</Col>
                </Form.Group>
                {!review.pastOperation && (
                    <Form.Group as={Row} className="p-0 m-0 pb-1 d-flex flex-row align-items-center row-gap-2">
                        <Col className="px-0 py-1 m-0 pe-2" xs={11} xxl={"auto"}>
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
            <Form.Group as={Row} className="p-0 m-0 pb-3 pt-4 w-100 gap-3">
                <Col className="m-0 p-0 flex-grow-0">
                    <Tooltip text="Cancel">
                        <Button
                            label=""
                            type="button"
                            className="p-0 m-0"
                            variant="no-colors"
                            onClick={onCancel}
                        >
                            <Icon icon="fa-close" padding={false} />
                        </Button>
                    </Tooltip>
                </Col>
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
            />
        </Form>)}
    </>);
}

export default SingleReviewForm;
