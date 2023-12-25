import { Container, Col, Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ReactElement, useState } from "react";

import { DoctorReview, getOperationMonthAndYear, reviewEditableStatuses, reviewStatusToString } from "../../types/doctors/review";
import StarRating from "../utils/StarRating";
import ExpandableText from "../utils/ExpandableText";
import Icon from "../utils/Icon";
import useUser from "../../hooks/auth/useUsers";
import { sameUser } from "../../auth/userInfo";
import SingleReviewForm, { getGuidelinesLink } from "./SingleReviewForm";
import Button from "../utils/Button";
import Select from "../utils/Select";
import { useUserReviews } from "../../hooks/doctors/useReviews";
import LoadingWrapper from "../utils/LoadingWrapper";
import { ResponseError } from "../../hooks/useApiRequest";

interface ReviewProps {
    review: DoctorReview;
}

function SingleReviewCard({ review }: ReviewProps) {
    const { userInfo } = useUser();
    const { 
        mutateItem, 
        isMutateLoading, 
        isMutateError, 
        mutateError 
    } = useUserReviews(userInfo!);

    const [editingMode, setEditingMode] = useState(false);

    const currentUser = sameUser(review.addedBy, userInfo);
    const messageToUser = () => {switch(review.status) {
        case "PENDING_APPROVAL":
            return "Your review is not published yet.";
            case "DRAFT":
                return "Edit and submit your draft to publish.";
            case "REJECTED":
                return (<>All reviews must follow {getGuidelinesLink("our guidelines", "")} to be published.<br />{review.rejectionReason}</>);
    }};

    const editMenuOptions: ReadonlyMap<string, () => void> = new Map([
        ["Edit", () => setEditingMode(true)],
        ["Delete", () => mutateItem({...review, status: "DELETED"})]
    ]);

    const surgeryElementWrapper = (element: ReactElement) =>
        review.operationMonth ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Surgery {getOperationMonthAndYear(review)}</Tooltip>}>
                <div className="w-fit-content">{element}</div>
            </OverlayTrigger>
        ) : (
            <>{element}</>
        );

    return (editingMode 
        ? <SingleReviewForm originalReview={review} onCancel={() => setEditingMode(false)} />
        : <Container className={`p-2 m-0 ${currentUser ? "bg-very-light-yellow rounded" : ""}`}>
            <Row className="d-flex p-0 m-0 pb-2 align-items-center justify-content-between flex-nowrap">
                <Col className="m-0 p-0 flex-grow-0 strong">
                    {review.anonymous ? "Anonymous" : review.addedBy.username}
                </Col>
                <Col className="m-0 p-0 flex-grow-0" xs={1}>
                    {(review.pastOperation || review.futureOperation) && (
                        surgeryElementWrapper(<Icon icon="fa-scalpel" />)
                    )}
                </Col>
                <Col className="m-0 p-0 ps-1">
                    {currentUser && <span className="align-middle med-dark-grey fst-italic sm-font lh-normal">
                        {review.status !== "APPROVED" && reviewStatusToString(review.status)}
                    </span>}
                </Col>
                <Col className="d-flex justify-content-end icon-select flex-grow-0">
                    {currentUser && <Select
                                values={Array.from(editMenuOptions.keys())}
                                onChange={(selectedOptionKey: string | undefined) => {
                                    editMenuOptions.get(selectedOptionKey!)!();
                                }}
                                currentValue={undefined}
                                icon="fa-ellipsis"
                    />}
                </Col>
                <Col className="m-0 p-0 d-flex flex-grow-0 justify-content-end">
                    {review.rating && <StarRating rating={review.rating} color={true} />}
                </Col>
            </Row>
            <Row className="p-0 m-0">
                {(!currentUser || review.status === "APPROVED")
                    ? (<ExpandableText text={review.description || ""} initialLength={300} className="med-dark-grey white-space-pre-line" />)
                    : <>
                        <Col className="p-0">
                            {messageToUser()}
                        </Col>
                        <Col className="p-0 d-flex justify-content-end">
                            {reviewEditableStatuses.includes(review.status) && <Button
                                variant="primary"
                                label="Edit Review"
                                type="button"
                                onClick={() => setEditingMode(true)}
                                className="w-max-content"
                            />}
                        </Col>
                    </>
                }
            </Row>
            <LoadingWrapper isLoading={isMutateLoading} isError={isMutateError} error={mutateError as ResponseError} loaderText="Deleting..."/>
        </Container>);
}

export default SingleReviewCard;
