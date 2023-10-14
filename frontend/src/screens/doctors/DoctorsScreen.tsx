import { useEffect, useState } from "react";

import useDoctors from "../../hooks/doctors/useDoctors";
import LoadingWrapper from "../../components/utils/LoadingWrapper";
import { Doctor, newDoctor } from "../../types/doctors/doctor";
import DoctorsTable from "../../components/doctors/doctors/DoctorsTable";
import DoctorModal from "../../components/doctors/doctors/DoctorModal";
import Button from "../../components/utils/Button";
import Title from "../../components/utils/Title";
import { objectsDiff } from "../../utils/utils";
import { ResponseError } from "../../hooks/useApiRequest";

function DoctorsScreen() {
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
    } = useDoctors();

    const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);

    useEffect(() => {
        if (isMutateSuccess) {
            setCurrentDoctor(null);
        }
    }, [isMutateSuccess]);

    return (
        <>
            <Title>Doctors</Title>
            <LoadingWrapper isLoading={isListLoading} isError={isListError} error={listError as ResponseError}>
                <DoctorsTable
                    doctors={data}
                    setCurrentDoctor={(doctorDoctor: Doctor | null) => {
                        resetMutation();
                        setCurrentDoctor(doctorDoctor);
                    }}
                    actionButton={
                        <Button label="Add doctor" variant="primary" onClick={() => setCurrentDoctor(newDoctor())} />
                    }
                />
                {currentDoctor && (
                    <DoctorModal
                        doctor={currentDoctor}
                        showModal={currentDoctor !== null}
                        onCancel={() => setCurrentDoctor(null)}
                        onSave={(updatedDoctor) => {
                            const dataToPost = { id: updatedDoctor.id, ...objectsDiff(currentDoctor, updatedDoctor) };
                            mutateItem(dataToPost);
                        }}
                        isSaving={isMutateLoading}
                        isSavingError={isMutateError}
                        savingError={mutateError as ResponseError}
                    />
                )}
            </LoadingWrapper>
        </>
    );
}

export default DoctorsScreen;
