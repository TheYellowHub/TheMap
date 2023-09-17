import { useMutation, useQuery, useQueryClient } from "react-query";

import { RequestDataItem, get, patch, post, put } from "../utils/request";

export default function genericApiHook<T extends RequestDataItem>(
    urlDirectory: string,
    sortKey = (t: T) => (t.id ? t.id : 0)
) {
    return function () {
        const queryClient = useQueryClient();
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
            error: ListError,
        } = useQuery({
            queryKey: [key],
            queryFn: fetchList,
        });

        const updateItem = async (t: T) => {
            const newItem = t.id === undefined;
            let fileProperties = {};
            const tWithoutfileProperties = { ...t };
            for (const property in t) {
                if (t[property] instanceof File) {
                    fileProperties = { ...fileProperties, property: t[property] };
                    delete tWithoutfileProperties[property];
                }
            }
            const url = `/api/${urlDirectory}` + (newItem ? "/create" : `/${t.id}/update`);
            let response = newItem ? await post(url, tWithoutfileProperties) : await patch(url, tWithoutfileProperties);
            if (0 < Object.keys(fileProperties).length) {
                const url = `/api/${urlDirectory}/${response.data.id}/update`;
                response = await patch(url, fileProperties);
            }
            return response.data;
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
            ListError,
            mutateItem,
            resetMutation,
            isMutateLoading,
            isMutateSuccess,
            isMutateError,
            mutateError,
        };
    };
}
