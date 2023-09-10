import { ID } from "../id";

export type DoctorSpeciality = {
    id: ID;
    name: string;
    active: boolean;
};

export const newDoctorSpeciality = (): DoctorSpeciality => {
    return {
        id: null,
        name: "",
        active: true,
    };
};
