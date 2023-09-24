import axios from "axios";

import { ID } from "../types/utils/id";

export type RequestUrl = string;

export type RequestDataItem = {
    id?: ID;
};

export type RequestData = RequestDataItem | Array<RequestDataItem>;

export type ResponseError = { message: string; response: { data: unknown } };

function getConfig(multipartFormData = false) {
    return {
        headers: {
            "Content-type": multipartFormData ? "multipart/form-data" : "application/json",
            // Authorization: `Bearer ${accessToken}`,  TODO
        },
    };
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

export function get(url: RequestUrl) {
    return axios.get(url, getConfig());
}

export function post(url: RequestUrl, data: RequestData, shouldExcludeId = true) {
    return axios.post(url, prepareData(data, shouldExcludeId), getConfig());
}

export function patch(url: RequestUrl, data: RequestData, shouldExcludeId = true) {
    let multipartFormData = false;
    for (const property in data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((data as any)[property] instanceof File) {
            multipartFormData = true;
            break;
        }
    }

    return axios.patch(url, prepareData(data, shouldExcludeId, multipartFormData), getConfig(multipartFormData));
}

export function put(url: RequestUrl, data: RequestData, shouldExcludeId = true) {
    return axios.put(url, prepareData(data, shouldExcludeId), getConfig());
}
