import { useMutation, useQuery, useQueryClient } from "react-query";

import useApiRequests, { RequestDataItem } from "./useApiRequest";

export default function useApi<T extends RequestDataItem>(urlDirectory: string, sortKey = (t: T) => (t.id ? t.id : 0)) {
    return function () {
        const queryClient = useQueryClient();
        const { get, post, patch } = useApiRequests();
        const key = urlDirectory;

        const fetchList = async () => {
            const response = await get(`/api/${urlDirectory}/list`);
            const list: T[] = response.data;
            list.sort((a: T, b: T) => (sortKey(a) < sortKey(b) ? -1 : 1));
            return response.data;
        };

        const {
            data,
            isLoading: isListLoading,
            isError: isListError,
            error: listError,
        } = useQuery({
            queryKey: [key],
            queryFn: fetchList,
        });

        const updateItem = async (t: T) => {
            const newItem = t.id === undefined;
            let fileProperties = {};
            let withoutfileProperties = { ...t };
            for (const property in t) {
                if (t[property] instanceof File) {
                    fileProperties = { ...fileProperties, [property]: t[property] };
                    delete withoutfileProperties[property];
                } else if (t[property] === undefined) {
                    withoutfileProperties = { ...withoutfileProperties, [property]: null };
                }
            }

            let response;
            let id = t.id;
            if (1 < Object.keys(withoutfileProperties).length) {
                const url = `/api/${urlDirectory}` + (newItem ? "/create" : `/${id}/update`);
                response = newItem ? await post(url, withoutfileProperties) : await patch(url, withoutfileProperties);
                id = response.data.id;
            }
            if (0 < Object.keys(fileProperties).length) {
                const url = `/api/${urlDirectory}/${id}/update`;
                response = await patch(url, fileProperties);
            }
            return response?.data;
        };

        const mutation = useMutation({
            mutationFn: (t: T) => updateItem(t),
            onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
        });

        const {
            mutate: mutateItem,
            reset: resetMutation,
            isLoading: isMutateLoading,
            isSuccess: isMutateSuccess,
            isError: isMutateError,
            error: mutateError,
        } = mutation;

        return {
            data: data || [],
            isListLoading,
            isListError,
            listError,
            mutateItem,
            resetMutation,
            isMutateLoading,
            isMutateSuccess,
            isMutateError,
            mutateError,
        };
    };
}
