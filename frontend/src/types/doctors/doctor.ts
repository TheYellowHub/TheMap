import { DistanceUnit, kmToMile } from "../../components/utils/DistanceUnit";
import useGoogleMaps, { Location } from "../../utils/googleMaps/useGoogleMaps";
import { DateTime } from "../utils/dateTime";
import { Email } from "../utils/email";
import { ID } from "../utils/id";
import { Phone } from "../utils/phone";
import { Url } from "../utils/url";

export type DoctorLocation = {
    hospitalName?: string;
    address?: string;
    lat?: number;
    lng?: number;
    phone?: Phone;
    email?: Email;
    privateOnly: boolean;
};

export const newDoctorLocation = (): DoctorLocation => {
    return { privateOnly: false };
};

export const doctorStatuses = ["PENDING_APPROVAL", "APPROVED", "REJECTED"] as const;
export type DoctorStatus = (typeof doctorStatuses)[number];
export const doctorStatusToString = (status: DoctorStatus) => status.replaceAll("_", " ");

export const doctorGenders = ["M", "F"] as const;
export type DoctorGender = (typeof doctorGenders)[number];
export const doctorGenderToString = (gender: DoctorGender) =>
    new Map([
        ["M", "Male"],
        ["F", "Female"],
    ]).get(gender) as string;

export type Doctor = {
    id?: ID;
    fullName: string;
    gender: DoctorGender;
    locations: DoctorLocation[];
    category?: string;
    specialities: string[];
    websites: Url[];
    iCareBetter?: Url;
    nancysNook?: boolean;
    image?: File | string;
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
        gender: "M",
        locations: [],
        specialities: [],
        websites: [],
    };
};

export function doctorDistanceFromLocation(doctor: Doctor, location: Location, distanceUnit: DistanceUnit): number {
    const { getDistance } = useGoogleMaps();

    let distance = Math.min(
        ...doctor.locations
            .filter((doctorLocation) => doctorLocation.lat && doctorLocation.lng)
            .map((doctorLocation) =>
                getDistance(location, { lat: Number(doctorLocation.lat!), lng: Number(doctorLocation.lng!) })
            )
            .filter((distance) => distance !== undefined)
    );

    if (distanceUnit === "Mile" && distance !== Infinity) {
        distance = kmToMile(distance);
    }

    return distance;
}
