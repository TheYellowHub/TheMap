import { DoctorSpeciality } from "../../../types/doctors/DoctorSpeciality";
import Modal, { type ModalFieldType, type ModalField } from "../../utils/Modal";

interface DoctorSpecialitiesModalProps {
    doctorSpeciality: DoctorSpeciality;
    showModal: boolean;
    onCancel: () => void;
    onSave: (DoctorSpeciality: DoctorSpeciality) => void;
    isSaving: boolean;
    isSavingError: boolean;
    savingError: unknown; // TODO: change unknown ?
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
            label: "ID",
            getter: (doctorSpeciality: DoctorSpeciality) => doctorSpeciality.name,
            setter: undefined,
            readonly: true,
        },
        {
            label: "Name",
            getter: (doctorSpeciality: DoctorSpeciality) => doctorSpeciality.name,
            setter: (doctorSpeciality: DoctorSpeciality, newName: ModalFieldType) => {
                return { ...doctorSpeciality, name: newName as string };
            },
            readonly: false,
        },
        {
            label: "Active",
            getter: (doctorSpeciality: DoctorSpeciality) => doctorSpeciality.active,
            setter: (doctorSpeciality: DoctorSpeciality, newState: ModalFieldType) => {
                return { ...doctorSpeciality, active: newState as boolean };
            },
            readonly: false,
        },
    ];

    return (
        <Modal<DoctorSpeciality>
            t={doctorSpeciality}
            fields={fields}
            getTitle={(doctorSpeciality: DoctorSpeciality) => {
                return (
                    "Doctor Speciality - " +
                    (doctorSpeciality.id !== null
                        ? `${doctorSpeciality.id} ${doctorSpeciality.name}`
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

export default DoctorSpecialitiesModal;
