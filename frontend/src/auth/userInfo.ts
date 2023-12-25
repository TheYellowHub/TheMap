import { ID } from "../types/utils/id";
import { ModalField } from "../utils/fields";

export type UserInfo = {
    id: ID;
    remoteId: string;
    username?: string;
    savedDoctors?: ID[];
};

export const sameUser = (a?: UserInfo, b?: UserInfo) => a?.remoteId === b?.remoteId;

export const userInfoFieldsMap: ReadonlyMap<string, ModalField<UserInfo>> = new Map([
    [
        "ID",
        {
            type: "number",
            label: "ID",
            getter: (userInfo: UserInfo) => userInfo.id,
        },
    ],
    [
        "remoteId",
        {
            type: "text",
            label: "Remote ID",
            getter: (userInfo: UserInfo) => userInfo.remoteId,
        },
    ],
    [
        "username",
        {
            type: "text",
            label: "Username",
            required: true,
            getter: (userInfo: UserInfo) => userInfo.username,
            setter: (userInfo: UserInfo, newValue: string) => {
                return { ...userInfo, username: newValue };
            },
        },
    ],
]);
