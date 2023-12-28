import { Container, Col, Row } from "react-bootstrap";
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
import { useReviews } from "../../hooks/doctors/useReviews";
import LoadingWrapper from "../utils/LoadingWrapper";
import { ResponseError } from "../../hooks/useApiRequest";
import Tooltip from "../utils/Tooltip";
import { getDoctorUrl } from "../../types/doctors/doctor";

interface ReviewProps {
    review: DoctorReview;
    showDoctorName?: boolean;
    showEditMessageInsteadOfCOntent?: boolean;
}

function SingleReviewCard({ review, showDoctorName = false, showEditMessageInsteadOfCOntent = true }: ReviewProps) {
    const { userInfo } = useUser();
    const { 
        mutateItem, 
        isMutateLoading, 
        isMutateError, 
        mutateError 
    } = useReviews();

    const [editingMode, setEditingMode] = useState(false);

    const currentUser = sameUser(review.addedBy, userInfo);

    const showEditMessage = showEditMessageInsteadOfCOntent && currentUser && review.status !== "APPROVED";

    const editMessageToUser = () => {switch(review.status) {
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
            <Tooltip text={`Surgery ${getOperationMonthAndYear(review)}`}>
                <div className="w-fit-content">{element}</div>
            </Tooltip>
        ) : (
            <>{element}</>
        );

    return (editingMode 
        ? <SingleReviewForm originalReview={review} onCancel={() => setEditingMode(false)} onSuccess={showEditMessageInsteadOfCOntent ? undefined : (() => setEditingMode(false))} />
        : <Container className={`p-3 m-0 med-grey-border rounded ${currentUser ? "bg-very-light-yellow" : ""}`}>
            <Row className="p-0 flex-sm-nowrap ">
                <Col className="d-flex flex-column justify-content-between">
                    <Row className="d-flex p-0 m-0 pb-2">
                        <Col className="text-nowrap flex-grow-0 pe-3">
                            {showDoctorName && (<Row key={`review-${review.id}-doctor`} className="pb-2">
                                <Col className="p-0 m-0">
                                    <a href={getDoctorUrl(review.doctor)} className="strong dark-grey a-only-hover-decoration">
                                        {review.doctor.fullName}
                                    </a>
                                </Col>
                            </Row>)}
                            <Row className="flex-nowrap">
                                <Col className="m-0 p-0 flex-grow-0 strong med-dark-grey">
                                    {review.anonymous ? "Anonymous" : review.addedBy.username}
                                </Col>
                                <Col className="m-0 p-0 flex-grow-0">
                                    {(review.pastOperation || review.futureOperation) && (
                                        surgeryElementWrapper(<Icon icon="fa-scalpel" />)
                                    )}
                                </Col>
                            </Row>
                        </Col>
                        <Col className="m-0 p-0 flex-grow-0">
                            {currentUser && <span className="align-middle med-dark-grey fst-italic sm-font lh-normal text-nowrap">
                                {review.status === "APPROVED" ? review.updatedAt && (new Date(review.updatedAt)).toLocaleDateString("en-US") : reviewStatusToString(review.status)}
                            </span>}
                        </Col>
                    </Row>
                </Col>
                <Col className="d-flex flex-column align-items-end gap-3 pb-2 order-first order-sm-last" xs={12} sm={"auto"}>
                    <Row className="p-0 m-0 flex-nowrap flex-grow-0">
                        <Col className="p-0 d-flex justify-content-end icon-select flex-grow-0">
                            {currentUser && <Select
                                        values={Array.from(editMenuOptions.keys())}
                                        onChange={(selectedOptionKey: string | undefined) => {
                                            editMenuOptions.get(selectedOptionKey!)!();
                                        }}
                                        currentValue={undefined}
                                        icon="fa-ellipsis p-0"
                            />}
                        </Col>
                        {review.rating && <Col className="p-0 ps-3 d-flex flex-grow-0 justify-content-end">
                            <StarRating rating={review.rating} color={true} />
                        </Col>}
                    </Row>
                </Col>
            </Row>
            <Row className="flex-nowrap">
                <Col className="d-flex flex-column justify-content-end">
                    <Row className="p-0 m-0">
                        {showEditMessage
                            ? (<Col className="p-0">{editMessageToUser()}</Col>)
                            : (<ExpandableText text={review.description || ""} maxLength={300} maxRows={5} className="med-dark-grey white-space-pre-line" />)
                        }
                    </Row>
                </Col>
                <Col className="d-flex flex-column justify-content-end flex-grow-0 gap-3">
                    {showEditMessage && reviewEditableStatuses.includes(review.status) && <Button
                            variant="primary"
                            label="Edit Review"
                            type="button"
                            onClick={() => setEditingMode(true)}
                            className="w-max-content"
                    />}
                </Col>
            </Row>
            <LoadingWrapper isLoading={isMutateLoading} isError={isMutateError} error={mutateError as ResponseError} loaderText="Deleting..."/>
        </Container>);
}

export default SingleReviewCard;
