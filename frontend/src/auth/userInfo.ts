import { ID } from "../types/utils/id";

export type UserInfo = {
    id: ID;
    remoteId: string;
    savedDoctors?: ID[];
};
