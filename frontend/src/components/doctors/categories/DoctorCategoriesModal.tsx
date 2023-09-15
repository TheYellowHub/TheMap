import { DoctorCategory } from "../../../types/doctors/doctorCategory";
import Modal, { type NumberField, type ModalFieldType, type ModalField } from "../../utils/Modal";

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
            getter: (doctorCategory: DoctorCategory) => doctorCategory.id as number,
            setter: undefined,
        },
        {
            type: "text",
            label: "Name",
            getter: (doctorCategory: DoctorCategory) => doctorCategory.name,
            setter: (doctorCategory: DoctorCategory, newName: ModalFieldType) => {
                return { ...doctorCategory, name: newName as string };
            },
        },
        {
            type: "boolean",
            label: "Active",
            getter: (doctorCategory: DoctorCategory) => doctorCategory.active,
            setter: (doctorCategory: DoctorCategory, newState: ModalFieldType) => {
                return { ...doctorCategory, active: newState as boolean };
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
                    (doctorCategory.id !== null
                        ? `${doctorCategory.id} ${doctorCategory.name}`
                        : "New")
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
