import { useEffect, useState } from "react";

import useDoctorCategories from "../../hooks/doctors/useDoctorCategories";
import LoadingWrapper from "../../components/utils/LoadingWrapper";
import { DoctorCategory, newDoctorCategory } from "../../types/doctors/doctorCategory";
import DoctorCategoriesTable from "../../components/doctors/categories/DoctorCategoriesTable";
import DoctorCategoriesModal from "../../components/doctors/categories/DoctorCategoriesModal";
import Button from "../../components/utils/Button";
import Title from "../../components/utils/Title";
import { ResponseError } from "../../hooks/useApiRequest";

function DoctorCategoriesScreen() {
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
    } = useDoctorCategories();

    const [currentCategory, setCurrentCategory] = useState<DoctorCategory | null>(null);

    useEffect(() => {
        if (isMutateSuccess) {
            setCurrentCategory(null);
        }
    }, [isMutateSuccess]);

    return (
        <>
            <Title>Doctor categories</Title>
            <LoadingWrapper isLoading={isListLoading} isError={isListError} error={listError as ResponseError}>
                <DoctorCategoriesTable
                    categories={data}
                    setCurrentCategory={(doctorCategory: DoctorCategory | null) => {
                        resetMutation();
                        setCurrentCategory(doctorCategory);
                    }}
                    actionButton={
                        <Button
                            label="Add category"
                            variant="primary"
                            onClick={() => setCurrentCategory(newDoctorCategory())}
                        />
                    }
                />
                {currentCategory && (
                    <DoctorCategoriesModal
                        doctorCategory={currentCategory}
                        showModal={currentCategory !== null}
                        onCancel={() => setCurrentCategory(null)}
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

export default DoctorCategoriesScreen;
