import { useEffect, useState } from "react";

import useDoctorSpecialities from "../../hooks/doctors/useDoctorSpecialities";
import LoadingWrapper from "../../components/utils/LoadingWrapper";
import { DoctorSpeciality, newDoctorSpeciality } from "../../types/doctors/DoctorSpeciality";
import DoctorSpecialitiesTable from "../../components/doctors/specialities/DoctorSpecialitiesTable";
import DoctorSpecialitiesModal from "../../components/doctors/specialities/DoctorSpecialityModal";
import Button from "../../components/utils/Button";
import Title from "../../components/utils/Title";

function DoctorSpecialitiesScreen() {
    const {
        data,
        isListLoading,
        isListError,
        ListError,
        mutateItem,
        resetMutation,
        isMutateLoading,
        isMutateSuccess,
        isMutateError,
        mutateError,
    } = useDoctorSpecialities();

    const [currentSpeciality, setCurrentSpeciality] = useState<DoctorSpeciality | null>(null);

    useEffect(() => {
        if (isMutateSuccess) {
            setCurrentSpeciality(null);
        }
    }, [isMutateSuccess]);

    return (
        <>
            <Title>Doctor specialities</Title>
            <LoadingWrapper isLoading={isListLoading} isError={isListError} error={ListError}>
                <DoctorSpecialitiesTable
                    specialities={data}
                    setCurrentSpeciality={(doctorSpeciality: DoctorSpeciality | null) => {
                        resetMutation();
                        setCurrentSpeciality(doctorSpeciality);
                    }}
                />
                {currentSpeciality && (
                    <DoctorSpecialitiesModal
                        doctorSpeciality={currentSpeciality}
                        showModal={currentSpeciality !== null}
                        onCancel={() => setCurrentSpeciality(null)}
                        onSave={mutateItem}
                        isSaving={isMutateLoading}
                        isSavingError={isMutateError}
                        savingError={mutateError}
                    />
                )}
                <Button
                    label="Add speciality"
                    variant="success"
                    onClick={() => setCurrentSpeciality(newDoctorSpeciality())}
                />
            </LoadingWrapper>
        </>
    );
}

export default DoctorSpecialitiesScreen;
