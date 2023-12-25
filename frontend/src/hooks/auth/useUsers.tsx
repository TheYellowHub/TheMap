import { useMutation, useQuery, useQueryClient } from "react-query";
import { User } from "@auth0/auth0-react";

import useApiRequests from "../useApiRequest";
import { UserInfo } from "../../auth/userInfo";
import useAuth from "../../auth/useAuth";

export default function useUser(user?: User) {
    const userRemoteId = (user || useAuth().user)?.sub;
    const queryClient = useQueryClient();
    const { get, patch, deleteItem } = useApiRequests();
    const url = `/api/users/user/${userRemoteId}`;

    const getUserInfo = async (): Promise<UserInfo | undefined> => {
        if (userRemoteId) {
            try {
                const response = await get(url);
                return response?.data;
            } catch (error) {
                if ((error as {response?: {status?: number}})?.response?.status === 404) {
                    return {
                        remoteId: userRemoteId,
                        savedDoctors: [],
                    } as unknown as UserInfo;
                } else {
                    throw error;
                }
            }
        } else {
            return undefined;
        }
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

    // Username 

    const setUsername = async (username: string) => {
        if (userInfo === undefined) {
            return undefined;
        } else {
            userInfo.username = username;
            const response = await patch(url, { ...userInfo });
            return response?.data;
        }
    };

    const setUsernameMutation = useMutation({
        mutationFn: setUsername,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: userInfoQueryKey }),
    });

    const {
        mutate: mutateUsername,
        reset: resetUsernameMutation,
        isLoading: isUsernameMutationLoading,
        isSuccess: isUsernameMutationSuccess,
        isError: isUsernameMutationError,
        error: usernameMutationError,
    } = setUsernameMutation;

    // Saved docters

    const saveOrRemoveDoctor = async (doctorId: number) => {
        if (userInfo === undefined) {
            return undefined;
        } else {
            if (userInfo.savedDoctors?.includes(doctorId)) {
                userInfo.savedDoctors = userInfo.savedDoctors?.filter(
                    (existingDoctorId: number) => existingDoctorId !== doctorId
                );
            } else {
                userInfo.savedDoctors?.push(doctorId);
            }
            const response = await patch(url, { ...userInfo });
            return response?.data;
        }
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

    // Delete user 

    const deleteUserFn = async () => {
        if (userInfo === undefined) {
            return undefined;
        } else {
            const response = await deleteItem(`${url}/delete`);
            return response?.data;
        }
    };

    const deleteUserMutation = useMutation({
        mutationFn: deleteUserFn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: userInfoQueryKey }),
    });

    const {
        mutate: deleteUser,
        reset: resetDeleteUserMutation,
        isLoading: isDeleteUserMutationLoading,
        isSuccess: isDeleteUsersMutationSuccess,
        isError: isDeleteUserMutationError,
        error: deleteUserMutationError,
    } = deleteUserMutation;


    // Return

    return {
        userInfo,
        isUserInfoLoading,
        isUserInfoError,
        userInfoError,
        // Username
        mutateUsername,
        resetUsernameMutation,
        isUsernameMutationLoading,
        isUsernameMutationSuccess,
        isUsernameMutationError,
        usernameMutationError,
        // Saved doctors
        mutateSavedDoctors,
        resetSavedDoctorsMutation,
        isSavedDoctorsMutationLoading,
        isSavedDoctorsMutationSuccess,
        isSavedDoctorsMutationError,
        savedDoctorsMutationError,
        // Delete user
        deleteUser,
        resetDeleteUserMutation,
        isDeleteUserMutationLoading,
        isDeleteUsersMutationSuccess,
        isDeleteUserMutationError,
        deleteUserMutationError,
    };
}
