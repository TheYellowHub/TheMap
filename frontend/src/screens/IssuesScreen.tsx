import { useEffect, useState } from "react";

import LoadingWrapper from "../components/utils/LoadingWrapper";
import Title from "../components/utils/Title";
import { objectsDiff } from "../utils/utils";
import { ResponseError } from "../hooks/useApiRequest";
import { useIssues } from "../hooks/doctors/useIssues";
import { DoctorIssue } from "../types/doctors/issue";
import IssuesTable from "../components/issues/IssuesTable";
import IssueModal from "../components/issues/IssueModal";

function IssuesScreen() {
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
    } = useIssues();

    const [currentIssue, setCurrentIssue] = useState<DoctorIssue | null>(null);

    useEffect(() => {
        if (isMutateSuccess) {
            setCurrentIssue(null);
        }
    }, [isMutateSuccess]);

    return (
        <>
            <Title>Issues</Title>
            <LoadingWrapper isLoading={isListLoading} isError={isListError} error={listError as ResponseError}>
                <IssuesTable
                    issues={data}
                    setCurrentIssue={(issue: DoctorIssue | null) => {
                        resetMutation();
                        setCurrentIssue(issue);
                    }}
                />
                {currentIssue && (
                    <IssueModal
                        issue={currentIssue}
                        showModal={currentIssue !== null}
                        onCancel={() => setCurrentIssue(null)}
                        onSave={(updatedDoctor) => {
                            const dataToPost = { id: updatedDoctor.id, ...objectsDiff(currentIssue, updatedDoctor) };
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

export default IssuesScreen;
