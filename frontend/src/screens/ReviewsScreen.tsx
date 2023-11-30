import { useEffect, useState } from "react";

import LoadingWrapper from "../components/utils/LoadingWrapper";
import Title from "../components/utils/Title";
import { objectsDiff } from "../utils/utils";
import { ResponseError } from "../hooks/useApiRequest";
import { useAllReviews } from "../hooks/doctors/useReviews";
import { DoctorReview } from "../types/doctors/review";
import ReviewsTable from "../components/reviews/ReviewsTable";
import ReviewModal from "../components/reviews/ReviewModal";

function ReviewsScreen() {
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
    } = useAllReviews();

    const [currentReview, setCurrentReview] = useState<DoctorReview | null>(null);

    useEffect(() => {
        if (isMutateSuccess) {
            setCurrentReview(null);
        }
    }, [isMutateSuccess]);

    return (
        <>
            <Title>Doctors</Title>
            <LoadingWrapper isLoading={isListLoading} isError={isListError} error={listError as ResponseError}>
                <ReviewsTable
                    reviews={data}
                    setCurrentReview={(review: DoctorReview | null) => {
                        resetMutation();
                        setCurrentReview(review);
                    }}
                />
                {currentReview && (
                    <ReviewModal
                        review={currentReview}
                        showModal={currentReview !== null}
                        onCancel={() => setCurrentReview(null)}
                        onSave={(updatedDoctor) => {
                            const dataToPost = { id: updatedDoctor.id, ...objectsDiff(currentReview, updatedDoctor) };
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

export default ReviewsScreen;
