import { ImageFileOrUrl } from "../Image";
import { ID } from "../utils/id";

export type DoctorCategory = {
    id?: ID;
    name: string;
    active: boolean;
    icon?: ImageFileOrUrl;
};

export const newDoctorCategory = (): DoctorCategory => {
    return {
        name: "",
        active: true,
    };
};
