import { ID } from "../id";
import { Url } from "../url";

export type DoctorLocation = {
    hospitalName?: string;
    address?: string;
    phone?: string;
    privateOnly: boolean;
};

export const newDoctorLocation = (): DoctorLocation => {
    return { privateOnly: false };
};

export type DateTime = string; // TODO

export const doctorStatuses = ["PENDING_APPROVAL", "APPROVED", "REJECTED"] as const;
export type DoctorStatus = (typeof doctorStatuses)[number];
export const doctorStatusToString = (status: DoctorStatus) => status.replaceAll("_", " ");

export type Doctor = {
    id?: ID;
    fullName: string;
    locations: DoctorLocation[];
    categories: string[]; // TODO: leave as string[]?
    specialities: string[]; // Same
    websites: Url[];
    iCareBetter?: Url;
    nancysNook?: boolean;
    image?: File;
    status?: DoctorStatus;
    // TODO: addedBy?: User;
    addedAt?: DateTime;
    approvedAt?: DateTime;
    rejectedAt?: DateTime;
    updatedAt?: DateTime;
    // TODO: reviews
    // TODO: average rating
};

export const newDoctor = (): Doctor => {
    return {
        fullName: "",
        locations: [],
        categories: [],
        specialities: [],
        websites: [],
    };
};
