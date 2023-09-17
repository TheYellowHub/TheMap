import { DoctorCategory } from "../../../types/doctors/doctorCategory";
import Modal from "../../utils/Modal";
import { ModalField } from "../../../types/fields";

interface DoctorCategoriesModalProps {
    doctorCategory: DoctorCategory;
    showModal: boolean;
    onCancel: () => void;
    onSave: (DoctorCategory: DoctorCategory) => void;
    isSaving: boolean;
    isSavingError: boolean;
    savingError: any; // TODO: change unknown ?
}

function DoctorCategoriesModal({
    doctorCategory,
    showModal,
    onCancel,
    onSave,
    isSaving,
    isSavingError,
    savingError,
}: DoctorCategoriesModalProps) {
    const fields: ModalField<DoctorCategory>[] = [
        {
            type: "number",
            label: "ID",
            getter: (doctorCategory) => doctorCategory.id,
            setter: undefined,
        },
        {
            type: "text",
            label: "Name",
            required: true,
            getter: (doctorCategory) => doctorCategory.name,
            setter: (doctorCategory, newName) => {
                return { ...doctorCategory, name: newName };
            },
        },
        {
            type: "boolean",
            label: "Active",
            getter: (doctorCategory) => doctorCategory.active,
            setter: (doctorCategory, newState) => {
                return { ...doctorCategory, active: newState };
            },
        },
    ];

    return (
        <Modal<DoctorCategory>
            t={doctorCategory}
            fields={fields}
            getTitle={(doctorCategory: DoctorCategory) => {
                return (
                    "Doctor Category - " +
                    (doctorCategory.id !== null ? `${doctorCategory.id} ${doctorCategory.name}` : "New")
                );
            }}
            showModal={showModal}
            onCancel={onCancel}
            onSave={onSave}
            isSaving={isSaving}
            isSavingError={isSavingError}
            savingError={savingError}
        />
    );
}

export default DoctorCategoriesModal;
