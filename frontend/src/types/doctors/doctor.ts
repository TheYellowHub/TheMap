import { DistanceUnit } from "../../components/utils/DistanceUnit";
import useGoogleMaps, { Location } from "../../utils/googleMaps/useGoogleMaps";
import { ImageFileOrUrl } from "../Image";
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
    image?: ImageFileOrUrl;
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

export function getDoctorLocationDistance(
    doctorLocation: DoctorLocation,
    location: Location,
    distanceUnit?: DistanceUnit
) {
    const { getDistance } = useGoogleMaps();

    return getDistance(location, { lat: Number(doctorLocation.lat!), lng: Number(doctorLocation.lng!) }, distanceUnit);
}

export function getDoctorNearestLocation(doctor: Doctor, location: Location): DoctorLocation | null {
    const doctorLocations = doctor.locations
        .filter((doctorLocation) => doctorLocation.lat && doctorLocation.lng)
        .filter((doctorLocation) => getDoctorLocationDistance(doctorLocation, location) !== undefined)
        .sort((a, b) => getDoctorLocationDistance(a, location) - getDoctorLocationDistance(b, location));

    return doctorLocations.length === 0 ? null : doctorLocations[0];
}

export function getDoctorMinimalDistance(doctor: Doctor, location: Location, distanceUnit: DistanceUnit): number {
    const doctorLocation = getDoctorNearestLocation(doctor, location);

    return doctorLocation === null ? Infinity : getDoctorLocationDistance(doctorLocation, location, distanceUnit);
}
