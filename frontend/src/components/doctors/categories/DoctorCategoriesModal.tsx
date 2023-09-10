import { DoctorCategoty } from "../../../types/doctors/doctorCategory";
import Modal, { type ModalFieldType, type ModalField } from "../../utils/Modal";

interface DoctorCategoriesModalProps {
    doctorCategory: DoctorCategoty;
    showModal: boolean;
    onCancel: () => void;
    onSave: (doctorCategoty: DoctorCategoty) => void;
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
    const fields: ModalField<DoctorCategoty>[] = [
        {
            label: "ID",
            getter: (doctorCategory: DoctorCategoty) => doctorCategory.name,
            setter: undefined,
            readonly: true,
        },
        {
            label: "Name",
            getter: (doctorCategory: DoctorCategoty) => doctorCategory.name,
            setter: (doctorCategory: DoctorCategoty, newName: ModalFieldType) => {
                return { ...doctorCategory, name: newName as string };
            },
            readonly: false,
        },
        {
            label: "Active",
            getter: (doctorCategory: DoctorCategoty) => doctorCategory.active,
            setter: (doctorCategory: DoctorCategoty, newState: ModalFieldType) => {
                return { ...doctorCategory, active: newState as boolean };
            },
            readonly: false,
        },
    ];

    return (
        <Modal<DoctorCategoty>
            t={doctorCategory}
            fields={fields}
            getTitle={(doctorCategory: DoctorCategoty) => {
                return (
                    "Doctor Category - " +
                    (doctorCategory
                        ? `${doctorCategory.id} ${doctorCategory.name}`
                        : "Add a new category")
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
