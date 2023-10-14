import { DoctorSpeciality } from "../../../types/doctors/DoctorSpeciality";
import Modal from "../../utils/Modal";
import { ModalField } from "../../../utils/fields";
import { ResponseError } from "../../../hooks/useApiRequest";

interface DoctorSpecialitiesModalProps {
    doctorSpeciality: DoctorSpeciality;
    showModal: boolean;
    onCancel: () => void;
    onSave: (DoctorSpeciality: DoctorSpeciality) => void;
    isSaving: boolean;
    isSavingError: boolean;
    savingError: ResponseError;
}

function DoctorSpecialitiesModal({
    doctorSpeciality,
    showModal,
    onCancel,
    onSave,
    isSaving,
    isSavingError,
    savingError,
}: DoctorSpecialitiesModalProps) {
    const fields: ModalField<DoctorSpeciality>[] = [
        {
            type: "number",
            label: "ID",
            getter: (doctorSpeciality) => doctorSpeciality.id,
            setter: undefined,
        },
        {
            type: "text",
            label: "Name",
            required: true,
            getter: (doctorSpeciality) => doctorSpeciality.name,
            setter: (doctorSpeciality, newName) => {
                return { ...doctorSpeciality, name: newName };
            },
        },
        {
            type: "boolean",
            label: "Active",
            getter: (doctorSpeciality) => doctorSpeciality.active,
            setter: (doctorSpeciality, newState) => {
                return { ...doctorSpeciality, active: newState };
            },
        },
    ];

    return (
        <Modal<DoctorSpeciality>
            t={doctorSpeciality}
            fields={fields}
            getTitle={(doctorSpeciality: DoctorSpeciality) => {
                return (
                    "Doctor Speciality - " +
                    (doctorSpeciality.id !== null ? `${doctorSpeciality.id} ${doctorSpeciality.name}` : "New")
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

export default DoctorSpecialitiesModal;
