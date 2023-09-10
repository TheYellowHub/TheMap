import { useEffect, useState } from "react";

import useDoctorCategories from "../../../hooks/doctors/useDoctorCategories";
import LoadingWrapper from "../../../components/utils/LoadingWrapper";
import { DoctorCategoty, newDoctorCategory } from "../../../types/doctors/doctorCategory";
import DoctorCategoriesTable from "../../../components/doctors/categories/DoctorCategoriesTable";
import DoctorCategoriesModal from "../../../components/doctors/categories/DoctorCategoriesModal";
import Button from "../../../components/utils/Button";
import Title from "../../../components/utils/Title";

function DoctorCategoriesScreen() {
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
    } = useDoctorCategories();

    const [currentCategory, setCurrentCategory] = useState<DoctorCategoty | null>(null);

    useEffect(() => {
        if (isMutateSuccess) {
            setCurrentCategory(null);
        }
    }, [isMutateSuccess]);

    return (
        <>
            <Title>Doctor categories</Title>
            <LoadingWrapper isLoading={isListLoading} isError={isListError} error={ListError}>
                <DoctorCategoriesTable
                    categories={data}
                    setCurrentCategory={(doctorCategory: DoctorCategoty | null) => {
                        resetMutation();
                        setCurrentCategory(doctorCategory);
                    }}
                />
                {currentCategory && (
                    <DoctorCategoriesModal
                        doctorCategory={currentCategory}
                        showModal={currentCategory !== null}
                        onCancel={() => setCurrentCategory(null)}
                        onSave={mutateItem}
                        isSaving={isMutateLoading}
                        isSavingError={isMutateError}
                        savingError={mutateError}
                    />
                )}
                <Button
                    label="Add category"
                    variant="success"
                    onClick={() => setCurrentCategory(newDoctorCategory())}
                />
            </LoadingWrapper>
        </>
    );
}

export default DoctorCategoriesScreen;
