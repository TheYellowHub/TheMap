import { UserInfo } from "../../auth/userInfo";
import { ModalField } from "../../utils/fields";
import { ID } from "../utils/id";
import { Doctor } from "./doctor";

export const reviewStatuses = ["DRAFT", "PENDING_APPROVAL", "APPROVED", "REJECTED", "DELETED"] as const;
export const reviewEditableStatuses = ["DRAFT", "PENDING_APPROVAL", "REJECTED"] as const;
export type ReviewStatus = (typeof reviewStatuses)[number];
export const ReviewStatusToString = (status: ReviewStatus) => status.replaceAll("_", " ");

export type DoctorReview = {
    id?: ID;
    doctor: Doctor;
    addedBy: UserInfo;
    description?: string;
    rating?: number;
    pastOperation?: boolean;
    futureOperation?: boolean;
    operationMonth?: string; // yyyy-mm-dd
    status?: ReviewStatus;
    rejectionReason?: string;
};

export function getOperationMonth(review: DoctorReview) {
    return review.operationMonth && review.operationMonth.substring(5, 7) + "/" + review.operationMonth.substring(0, 4);
}

export const getNewReview = (doctor: Doctor, userInfo: UserInfo): DoctorReview => {
    return { doctor: doctor, addedBy: userInfo };
};

export const reviewFieldsMap: ReadonlyMap<string, ModalField<DoctorReview>> = new Map([
    [
        "ID",
        {
            type: "number",
            label: "ID",
            getter: (review: DoctorReview) => review.id,
            setter: undefined,
        },
    ],
    [
        "description",
        {
            type: "text",
            label: "description",
            required: true,
            getter: (review: DoctorReview) => review.description,
            setter: (review: DoctorReview, newValue: string) => {
                return { ...review, description: newValue };
            },
        },
    ],
    // TODO
    // {
    //     type: "boolean",
    //     label: "pastOperation",
    //     getter: (doctor) => doctor.pastOperation,
    //     setter: (doctor, newValue) => {
    //         return { ...doctor, pastOperation: newValue };
    //     },
    // },
    // {
    //     type: "boolean",
    //     label: "futureOperation",
    //     getter: (doctor) => doctor.futureOperation,
    //     setter: (doctor, newValue) => {
    //         return { ...doctor, futureOperation: newValue };
    //     },
    // },
    // {
    //     type: "singleSelect",
    //     label: "Status",
    //     getter: (doctor) => doctor.status,
    //     setter: (doctor, newValue) => {
    //         return { ...doctor, status: newValue as DoctorStatus };
    //     },
    //     options: doctorStatuses.map((status) => {
    //         return {
    //             value: status,
    //             label: doctorStatusToString(status),
    //         };
    //     }),
    //     required: true,
    // },
    // {
    //     type: "text",
    //     label: "Added by",
    //     getter: (doctor) => doctor.addedBy,
    // },
    // {
    //     type: "datetime",
    //     label: "Added at",
    //     getter: (doctor) => doctor.addedAt,
    // },
    // {
    //     type: "datetime",
    //     label: "Approved at",
    //     getter: (doctor) => doctor.approvedAt,
    // },
    // {
    //     type: "datetime",
    //     label: "Rejected at",
    //     getter: (doctor) => doctor.rejectedAt,
    // },
    // {
    //     type: "datetime",
    //     label: "Updated at",
    //     getter: (doctor) => doctor.updatedAt,
    // },
]);
