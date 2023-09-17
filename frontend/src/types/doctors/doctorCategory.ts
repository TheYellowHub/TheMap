import { ID } from "../id";

export type DoctorCategory = {
    id?: ID;
    name: string;
    active: boolean;
};

export const newDoctorCategory = (): DoctorCategory => {
    return {
        name: "",
        active: true,
    };
};
