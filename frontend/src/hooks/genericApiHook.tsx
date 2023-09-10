import { useMutation, useQuery, useQueryClient } from "react-query";

import { RequestDataItem, get, post, put } from "../utils/request";

export default function genericApiHook<T extends RequestDataItem>(
    urlDirectory: string,
    sortKey = (t: T) => (t.id ? t.id : 0)
) {
    return function () {
        const queryClient = useQueryClient();
        const key = urlDirectory;

        const fetchCategories = async () => {
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
            queryFn: fetchCategories,
        });

        const updateCategory = async (t: T) => {
            const url = `/api/${urlDirectory}` + (t.id === null ? "/create" : `/${t.id}/update`);
            const data = t.id === null ? await post(url, t) : await put(url, t);
            return data;
        };
        const mutation = useMutation({
            mutationFn: (t: T) => updateCategory(t),
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
