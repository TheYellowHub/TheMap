import { UserInfo } from "../../auth/userInfo";
import { ModalField } from "../../utils/fields";
import { DateTime, MonthName, monthNames } from "../utils/dateTime";
import { ID } from "../utils/id";
import { Doctor } from "./doctor";

export const reviewStatuses = ["DRAFT", "PENDING_APPROVAL", "APPROVED", "REJECTED", "DELETED"] as const;
export type ReviewStatus = (typeof reviewStatuses)[number];
export const reviewEditableStatuses: Readonly<ReviewStatus[]> = ["DRAFT", "PENDING_APPROVAL", "REJECTED"] as const;
export const reviewStatusToString = (status: ReviewStatus) => status.replaceAll("_", " ");

export type DoctorReview = {
    id?: ID;
    doctor: Doctor;
    addedBy: UserInfo;
    description?: string;
    rating?: number;
    pastOperation?: boolean;
    futureOperation?: boolean;
    operationMonth?: DateTime; // yyyy-mm-dd
    status: ReviewStatus;
    addedAt?: DateTime;
    approvedAt?: DateTime;
    rejectedAt?: DateTime;
    deletedAt?: DateTime;
    updatedAt?: DateTime;
    rejectionReason?: string;
};

export function getOperationMonthAndYear(review: DoctorReview) {
    return review.operationMonth === undefined || review.operationMonth === null
        ? undefined
        : getOperationMonth(review) + "/" + getOperationYear(review);
}

export function getOperationMonth(review: DoctorReview) {
    return review.operationMonth === undefined || review.operationMonth === null
        ? undefined
        : Number(review.operationMonth.substring(5, 7));
}

export function getOperationMonthName(review: DoctorReview) {
    const month = getOperationMonth(review);
    return month === undefined ? undefined : monthNames[month - 1];
}

export function getOperationYear(review: DoctorReview) {
    return review.operationMonth === undefined || review.operationMonth === null
        ? undefined
        : Number(review.operationMonth.substring(0, 4));
}

export function setOperationMonthAndYear(review: DoctorReview, month?: MonthName, year?: number): DoctorReview {
    const yearStr = year === undefined || Number.isNaN(year) ? undefined : year.toString().padStart(4, "0");
    const monthStr = month === undefined ? undefined : (monthNames.indexOf(month) + 1).toString().padStart(2, "0");
    return {
        ...review,
        operationMonth: month === undefined || year === undefined ? undefined : `${yearStr}-${monthStr}-01`,
    };
}

export const getNewReview = (doctor: Doctor, userInfo: UserInfo): DoctorReview => {
    return { doctor: doctor, addedBy: userInfo, status: "DRAFT" };
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
            type: "long-text",
            label: "description",
            required: true,
            getter: (review: DoctorReview) => review.description,
            setter: (review: DoctorReview, newValue: string) => {
                return { ...review, description: newValue };
            },
        },
    ],
    [
        "rating",
        {
            type: "number",
            label: "rating",
            required: true,
            getter: (review: DoctorReview) => review.rating,
            setter: (review: DoctorReview, newValue: number) => {
                return { ...review, rating: newValue };
            },
        },
    ],
    [
        "pastOperation",
        {
            type: "boolean",
            label: "Past operation",
            required: true,
            getter: (review: DoctorReview) => review.pastOperation,
            setter: (review: DoctorReview, newValue: boolean) => {
                return { ...review, pastOperation: newValue };
            },
        },
    ],
    [
        "futureOperation",
        {
            type: "boolean",
            label: "Future operation",
            required: true,
            getter: (review: DoctorReview) => review.futureOperation,
            setter: (review: DoctorReview, newValue: boolean) => {
                return { ...review, futureOperation: newValue };
            },
        },
    ],
    [
        "status",
        {
            type: "singleSelect",
            label: "Status",
            getter: (review: DoctorReview) => reviewStatusToString(review.status),
            setter: (review: DoctorReview, newValue: string | undefined) => {
                return { ...review, status: newValue as ReviewStatus };
            },
            options: reviewStatuses.map((status) => {
                return {
                    value: status,
                    label: reviewStatusToString(status),
                };
            }),
            required: true,
        },
    ],
    [
        "addedBy",
        {
            type: "text",
            label: "Added by",
            getter: (review: DoctorReview) => review.addedBy.remoteId,
        },
    ],
    [
        "addedAt",
        {
            type: "datetime",
            label: "Added at",
            getter: (review: DoctorReview) => review.addedAt,
        },
    ],
    [
        "approvedAt",
        {
            type: "datetime",
            label: "Approved at",
            getter: (review: DoctorReview) => review.approvedAt,
        },
    ],
    [
        "rejectedAt",
        {
            type: "datetime",
            label: "Rejected at",
            getter: (review: DoctorReview) => review.rejectedAt,
        },
    ],
    [
        "deletedAt",
        {
            type: "datetime",
            label: "Deleted at",
            getter: (review: DoctorReview) => review.deletedAt,
        },
    ],
    [
        "updatedAt",
        {
            type: "datetime",
            label: "Updated at",
            getter: (review: DoctorReview) => review.updatedAt,
        },
    ],
    [
        "rejectionReason",
        {
            type: "text",
            label: "Rejection reason",
            required: false,
            getter: (review: DoctorReview) => review.rejectionReason,
            setter: (review: DoctorReview, newValue: string) => {
                return { ...review, rejectionReason: newValue };
            },
        },
    ],
]);
