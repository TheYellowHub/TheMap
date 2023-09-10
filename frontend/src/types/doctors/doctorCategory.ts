import { ID } from "../id";

export type DoctorCategoty = {
    id: ID;
    name: string;
    active: boolean;
};

export const newDoctorCategory = (): DoctorCategoty => {
    return {
        id: null,
        name: "",
        active: true,
    };
};
