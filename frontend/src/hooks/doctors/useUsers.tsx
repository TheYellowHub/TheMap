import { useMutation, useQuery, useQueryClient } from "react-query";
import { User } from "@auth0/auth0-react";

import useApiRequests from "../useApiRequest";

export default function useUser(user?: User) {
    const userRemoteId = user?.sub;
    const queryClient = useQueryClient();
    const { get, post, patch } = useApiRequests();
    const url = `/api/users/user/${userRemoteId}`;

    const getUserInfo = async () => {
        const response = userRemoteId ? await get(url) : undefined;
        return response?.data;
    };

    const userInfoQueryKey = `user/${userRemoteId}`;

    const {
        data: userInfo,
        isLoading: isUserInfoLoading,
        isError: isUserInfoError,
        error: userInfoError,
    } = useQuery({
        queryKey: [userInfoQueryKey],
        queryFn: getUserInfo,
    });

    const saveOrRemoveDoctor = async (doctorId: number) => {
        if (userInfo.savedDoctors.includes(doctorId)) {
            userInfo.savedDoctors = userInfo.savedDoctors.filter(
                (existingDoctorId: number) => existingDoctorId !== doctorId
            );
        } else {
            userInfo.savedDoctors.push(doctorId);
        }
        const response = await patch(url, { ...userInfo });
        return response?.data;
    };

    const savedDoctorsMutation = useMutation({
        mutationFn: saveOrRemoveDoctor,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: userInfoQueryKey }),
    });

    const {
        mutate: mutateSavedDoctors,
        reset: resetSavedDoctorsMutation,
        isLoading: isSavedDoctorsMutationLoading,
        isSuccess: isSavedDoctorsMutationSuccess,
        isError: isSavedDoctorsMutationError,
        error: savedDoctorsMutationError,
    } = savedDoctorsMutation;

    return {
        userInfo,
        isUserInfoLoading,
        isUserInfoError,
        userInfoError,
        // saved doctors
        mutateSavedDoctors,
        resetSavedDoctorsMutation,
        isSavedDoctorsMutationLoading,
        isSavedDoctorsMutationSuccess,
        isSavedDoctorsMutationError,
        savedDoctorsMutationError,
    };
}
