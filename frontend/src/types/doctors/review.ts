import { UserInfo } from "../../auth/userInfo";
import Review from "../../components/reviews/Review";
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
    operationMonth?: string; // yyyy-mm-dd
};

export function getOperationMonth(review: DoctorReview) {
    return review.operationMonth && review.operationMonth.substring(5, 7) + "/" + review.operationMonth.substring(0, 4);
}

export const newReview = (): DoctorReview => {
    return {};
};
