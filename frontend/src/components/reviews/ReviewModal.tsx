import Modal from "../utils/Modal";
import { ResponseError } from "../../hooks/useApiRequest";
import { DoctorReview, reviewFieldsMap } from "../../types/doctors/review";
import SingleReviewCard from "./SingleReviewCard";

interface ReviewModalProps {
    review: DoctorReview;
    showModal: boolean;
    onCancel: () => void;
    onSave: (review: DoctorReview) => void;
    isSaving: boolean;
    isSavingError: boolean;
    savingError: ResponseError;
}

function ReviewModal({ review, showModal, onCancel, onSave, isSaving, isSavingError, savingError }: ReviewModalProps) {
    const fields = [
        reviewFieldsMap.get("status")!,
        reviewFieldsMap.get("rejectionReason")!,
        reviewFieldsMap.get("internalNotes")!,
        reviewFieldsMap.get("addedAt")!,
        reviewFieldsMap.get("approvedAt")!,
        reviewFieldsMap.get("rejectedAt")!,
        reviewFieldsMap.get("updatedAt")!,
        reviewFieldsMap.get("deletedAt")!,
    ];

    return (
        <Modal<DoctorReview>
            t={review}
            fields={fields}
            getTitle={(review: DoctorReview) => {
                return `Doctor Review - ${review.id} / ${review.doctor.fullName}`;
            }}
            showModal={showModal}
            onCancel={onCancel}
            onSave={onSave}
            isSaving={isSaving}
            isSavingError={isSavingError}
            savingError={savingError}
        >
            <div className="strong pb-1">{review.addedBy.remoteId}</div>
            <SingleReviewCard review={review} showDoctorName={true} />
        </Modal>
    );
}

export default ReviewModal;
