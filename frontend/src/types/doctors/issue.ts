import { UserInfo } from "../../auth/userInfo";
import { ModalField } from "../../utils/fields";
import { DateTime } from "../utils/dateTime";
import { ID } from "../utils/id";
import { Doctor } from "./doctor";

export const issueStatuses = ["PENDING", "MODIFICATION_NEEDED", "PUBLISHED", "REJECTED", "DELETED"] as const;
export type IssueStatus = (typeof issueStatuses)[number];
export const issueStatusToString = (status: IssueStatus) => status.replaceAll("_", " ");

export type DoctorIssue = {
    id?: ID;
    doctor: Doctor;
    addedBy: UserInfo;
    description?: string;
    status: IssueStatus;
    addedAt?: DateTime;
    publishedAt?: DateTime;
    rejectedAt?: DateTime;
    deletedAt?: DateTime;
    updatedAt?: DateTime;
    rejectionReason?: string;
    internalNotes?:string;
};

export const getNewIssue = (doctor: Doctor, userInfo: UserInfo): DoctorIssue => {
    return { doctor: doctor, addedBy: userInfo, status: "PENDING" };
};

export const issueFieldsMap: ReadonlyMap<string, ModalField<DoctorIssue>> = new Map([
    [
        "ID",
        {
            type: "number",
            label: "ID",
            getter: (issue: DoctorIssue) => issue.id,
            setter: undefined,
        },
    ],
    [
        "description",
        {
            type: "long-text",
            label: "description",
            required: true,
            getter: (issue: DoctorIssue) => issue.description,
            setter: (issue: DoctorIssue, newValue: string) => {
                return { ...issue, description: newValue };
            },
        },
    ],
    [
        "status",
        {
            type: "singleSelect",
            label: "Status",
            getter: (issue: DoctorIssue) => issueStatusToString(issue.status),
            setter: (issue: DoctorIssue, newValue: string | undefined) => {
                return { ...issue, status: newValue as IssueStatus };
            },
            options: issueStatuses.map((status) => {
                return {
                    value: status,
                    label: issueStatusToString(status),
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
            getter: (issue: DoctorIssue) => issue.addedBy.remoteId,
        },
    ],
    [
        "addedAt",
        {
            type: "datetime",
            label: "Added at",
            getter: (issue: DoctorIssue) => issue.addedAt,
        },
    ],
    [
        "publishedAt",
        {
            type: "datetime",
            label: "Published at",
            getter: (issue: DoctorIssue) => issue.publishedAt,
        },
    ],
    [
        "rejectedAt",
        {
            type: "datetime",
            label: "Rejected at",
            getter: (issue: DoctorIssue) => issue.rejectedAt,
        },
    ],
    [
        "deletedAt",
        {
            type: "datetime",
            label: "Deleted at",
            getter: (issue: DoctorIssue) => issue.deletedAt,
        },
    ],
    [
        "updatedAt",
        {
            type: "datetime",
            label: "Updated at",
            getter: (issue: DoctorIssue) => issue.updatedAt,
        },
    ],
    [
        "rejectionReason",
        {
            type: "text",
            label: "Rejection reason",
            required: false,
            getter: (issue: DoctorIssue) => issue.rejectionReason,
            setter: (issue: DoctorIssue, newValue: string) => {
                return { ...issue, rejectionReason: newValue };
            },
        },
    ],
    [
        "internalNotes",
        {
            type: "text",
            label: "Internal notes",
            required: false,
            getter: (issue: DoctorIssue) => issue.internalNotes,
            setter: (issue: DoctorIssue, newValue: string) => {
                return { ...issue, internalNotes: newValue };
            },
        },
    ],
]);
