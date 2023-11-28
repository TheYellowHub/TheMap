import { Col, Row, Form } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";

import { DoctorReview, ReviewStatus, reviewFieldsMap } from "../../types/doctors/review";
import { useUserReviews } from "../../hooks/doctors/useReviews";
import Icon from "../utils/Icon";
import InputFormField from "../utils/form/inputField";
import { TextField } from "../../utils/fields";
import Button from "../utils/Button";

interface SingleReviewFormProps {
    originalReview: DoctorReview;
    setDeleted?: () => void;
    setSaved?: () => void;
}

function SingleReviewForm({ originalReview, setDeleted, setSaved }: SingleReviewFormProps) {
    const [review, setReview] = useState(originalReview);

    const { mutateItem, resetMutation, isMutateLoading, isMutateSuccess, isMutateError, mutateError } = useUserReviews(
        // TODO: handle errors
        review.addedBy,
        review.doctor
    )();

    type EditStatus = "CLOSED" | "EDITING" | "SAVED" | "SUBMITTED";
    const [editStatus, setEditStatus] = useState<EditStatus>(review.status !== "APPROVED" ? "EDITING" : "CLOSED");

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const inputs = formRef.current?.querySelectorAll("input");
        inputs?.forEach((input) =>
            input.addEventListener("input", (e) => {
                (e.target as HTMLInputElement).reportValidity();
            })
        );
    }, [formRef]);

    const submitForm = (newReviewStatue: ReviewStatus, newEditStatus: EditStatus) => {
        const inputs = formRef.current?.querySelectorAll("input");
        inputs?.forEach((input) => input?.reportValidity());

        if (formRef?.current?.checkValidity() === true) {
            const newReview = { ...review, status: newReviewStatue };
            setReview(newReview);
            mutateItem(newReview);
            setEditStatus(newEditStatus);
            setSaved && setSaved();
            return true;
        } else {
            return false;
        }
    };

    const [description, setDescription] = useState(review.description);
    const [rating, setRating] = useState(review.rating);
    const [pastOperation, setPastOperation] = useState(review.pastOperation);
    const [futureOperation, setFutureOperation] = useState(review.futureOperation);
    const [operationMonth, setOperationMonth] = useState(review.operationMonth);
    const [status, setStatus] = useState(review.status);

    return (
        <Form className="p-0 m-0" ref={formRef}>
            <fieldset disabled={review.status === "DELETED" || review.status === "APPROVED" || editStatus === "CLOSED"}>
                <Form.Group as={Row} className="p-0 m-0 pb-2 gap-3">
                    <Col className="m-0 p-0">
                        <strong>{review.addedBy?.remoteId}</strong>
                    </Col>
                    <Col>
                        {review.status} {review.id}
                    </Col>{" "}
                    {/* TODO: delete / design */}
                    <Col className="m-0 p-0 d-flex justify-content-end">
                        {/* {review.rating && <StarRating rating={review.rating} color={true} onChange={setRating} />} // TODO: support change*/}
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="p-0 m-0">
                    <InputFormField<DoctorReview>
                        field={reviewFieldsMap.get("description") as TextField<DoctorReview>}
                        object={review}
                        onChange={setReview}
                        placeHolder="......"
                    />
                </Form.Group>
                {/* TODO: Additional fields */}
                <Form.Group as={Row} className="p-0 m-0 w-100 gap-3">
                    <Col className="m-0 p-0" sm="auto">
                        <Button
                            label=""
                            type="button"
                            className="p-0 m-0"
                            variant="no-colors"
                            onClick={() => {
                                if (submitForm("DELETED", "CLOSED")) {
                                    setDeleted && setDeleted();
                                }
                            }}
                        >
                            <Icon icon="fa-close" padding={false} />
                        </Button>
                    </Col>
                    <Col className="m-0 p-0 d-flex justify-content-end">
                        <Button
                            variant="secondary"
                            label="Save for later"
                            type="button"
                            onClick={() => {
                                submitForm("DRAFT", "SAVED");
                            }}
                        />
                    </Col>
                    <Col variant="primary" className="m-0 p-0" sm="auto">
                        <Button
                            label="Submit"
                            type="button"
                            onClick={() => {
                                submitForm("PENDING_APPROVAL", "SUBMITTED");
                            }}
                        />
                    </Col>
                </Form.Group>
            </fieldset>
        </Form>
    );
}

export default SingleReviewForm;
