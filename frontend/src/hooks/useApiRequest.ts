import axios from "axios";

import { ID } from "../types/utils/id";
import useAuth from "../auth/useAuth";

export type RequestUrl = string;

export type RequestDataItem = {
    id?: ID;
};

export type RequestData = RequestDataItem | Array<RequestDataItem>;

export type ResponseError = { message: string; response: { data: unknown } };

export default function useApiRequests() {
    const { isAuthenticated, getAccessToken } = useAuth();

    async function getConfig(multipartFormData = false) {
        const accessToken = isAuthenticated && (await getAccessToken());

        const headers = {
            "Content-type": multipartFormData ? "multipart/form-data" : "application/json",
            Authorization: accessToken && `Bearer ${accessToken}`,
        };

        return { headers };
    }

    function prepareData(data: RequestData, shouldExcludeId = true, multipartFormData = false) {
        if (shouldExcludeId) {
            let dataWithoutId = null;
            if (Array.isArray(data)) {
                dataWithoutId = data.map((dataItem) => {
                    const { id: _, ...dataItemWithoutId } = dataItem;
                    return dataItemWithoutId;
                });
            } else {
                const { id: _, ...dataItemWithoutId } = data;
                dataWithoutId = dataItemWithoutId;
            }
            data = dataWithoutId;
        }

        return multipartFormData ? axios.toFormData(data) : data;
    }

    async function get(url: RequestUrl) {
        return axios.get(url, await getConfig());
    }

    async function post(url: RequestUrl, data: RequestData, shouldExcludeId = true) {
        return axios.post(url, prepareData(data, shouldExcludeId), await getConfig());
    }

    async function patch(url: RequestUrl, data: RequestData, shouldExcludeId = true) {
        let multipartFormData = false;
        for (const property in data) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((data as any)[property] instanceof File) {
                multipartFormData = true;
                break;
            }
        }

        return axios.patch(
            url,
            prepareData(data, shouldExcludeId, multipartFormData),
            await getConfig(multipartFormData)
        );
    }

    async function put(url: RequestUrl, data: RequestData, shouldExcludeId = true) {
        return axios.put(url, prepareData(data, shouldExcludeId), await getConfig());
    }

    async function deleteItem(url: RequestUrl) {
        return axios.delete(url, await getConfig());
    }

    return {
        get: get,
        post: post,
        put: put,
        patch: patch,
        deleteItem: deleteItem,
    };
}
