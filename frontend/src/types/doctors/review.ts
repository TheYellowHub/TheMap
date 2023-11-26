import { UserInfo } from "../../auth/userInfo";
import { ID } from "../utils/id";
import { Doctor } from "./doctor";

export type DoctorReview = {
    id?: ID;
    doctor?: Doctor;
    addedBy?: UserInfo;
    description?: string;
    rating?: number;
    pastOperation?: boolean;
    futureOperation?: boolean;
    operationMonth?: Date;
};

export const newReview = (): DoctorReview => {
    return {};
};
