import axios from "axios";

import { ID } from "../types/id";

export type RequestUrl = string;

export type RequestDataItem = {
    id: ID;
};

export type RequestData = RequestDataItem | Array<RequestDataItem>;

function getConfig() {
    return {
        headers: {
            "Content-type": "application/json",
            // Authorization: `Bearer ${accessToken}`,  TODO
        },
    };
}

function excludeId(data: RequestData, shouldExcludeId = true) {
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
        return dataWithoutId;
    } else {
        return data;
    }
}

export function get(url: RequestUrl) {
    return axios.get(url, getConfig());
}

export function post(url: RequestUrl, data: RequestData, shouldExcludeId = true) {
    return axios.post(url, excludeId(data, shouldExcludeId), getConfig());
}

export function patch(url: RequestUrl, data: RequestData, shouldExcludeId = true) {
    return axios.patch(url, excludeId(data, shouldExcludeId), getConfig());
}

export function put(url: RequestUrl, data: RequestData, shouldExcludeId = true) {
    return axios.put(url, excludeId(data, shouldExcludeId), getConfig());
}
