import { useEffect, useState } from "react";

import useDoctorSpecialities from "../../hooks/doctors/useDoctorSpecialities";
import LoadingWrapper from "../../components/utils/LoadingWrapper";
import { DoctorSpeciality, newDoctorSpeciality } from "../../types/doctors/DoctorSpeciality";
import DoctorSpecialitiesTable from "../../components/doctors/specialities/DoctorSpecialitiesTable";
import DoctorSpecialitiesModal from "../../components/doctors/specialities/DoctorSpecialityModal";
import Button from "../../components/utils/Button";
import Title from "../../components/utils/Title";
import { ResponseError } from "../../hooks/useApiRequest";

function DoctorSpecialitiesScreen() {
    const {
        data,
        isListLoading,
        isListError,
        listError,
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
            <LoadingWrapper isLoading={isListLoading} isError={isListError} error={listError as ResponseError}>
                <DoctorSpecialitiesTable
                    specialities={data}
                    setCurrentSpeciality={(doctorSpeciality: DoctorSpeciality | null) => {
                        resetMutation();
                        setCurrentSpeciality(doctorSpeciality);
                    }}
                    actionButton={
                        <Button
                            label="Add speciality"
                            variant="primary"
                            onClick={() => setCurrentSpeciality(newDoctorSpeciality())}
                        />
                    }
                />
                {currentSpeciality && (
                    <DoctorSpecialitiesModal
                        doctorSpeciality={currentSpeciality}
                        showModal={currentSpeciality !== null}
                        onCancel={() => setCurrentSpeciality(null)}
                        onSave={mutateItem}
                        isSaving={isMutateLoading}
                        isSavingError={isMutateError}
                        savingError={mutateError as ResponseError}
                    />
                )}
            </LoadingWrapper>
        </>
    );
}

export default DoctorSpecialitiesScreen;
