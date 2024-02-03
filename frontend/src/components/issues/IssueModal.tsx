import Modal from "../utils/ObjectModal";
import { ResponseError } from "../../hooks/useApiRequest";
import { DoctorIssue, issueFieldsMap } from "../../types/doctors/issue";

interface IssueModalProps {
    issue: DoctorIssue;
    showModal: boolean;
    onCancel: () => void;
    onSave: (issue: DoctorIssue) => void;
    isSaving: boolean;
    isSavingError: boolean;
    savingError: ResponseError;
}

function IssueModal({ issue, showModal, onCancel, onSave, isSaving, isSavingError, savingError }: IssueModalProps) {
    const fields = [
        issueFieldsMap.get("status")!,
        issueFieldsMap.get("rejectionReason")!,
        issueFieldsMap.get("internalNotes")!,
        issueFieldsMap.get("addedAt")!,
        issueFieldsMap.get("publishedAt")!,
        issueFieldsMap.get("rejectedAt")!,
        issueFieldsMap.get("updatedAt")!,
        issueFieldsMap.get("deletedAt")!,
    ];

    return (
        <Modal<DoctorIssue>
            t={issue}
            fields={fields}
            getTitle={(issue: DoctorIssue) => {
                return `Doctor Issue - ${issue.id} / ${issue.doctor.fullName}`;
            }}
            showModal={showModal}
            onCancel={onCancel}
            onSave={onSave}
            isSaving={isSaving}
            isSavingError={isSavingError}
            savingError={savingError}
        >
            {<strong>{issue.addedBy.remoteId}</strong>}
            <br />
            {issue.description}
        </Modal>
    );
}

export default IssueModal;
