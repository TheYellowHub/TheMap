import { userSavedProvidersUrl } from "../../AppRouter";
import { UserInfo } from "../../auth/userInfo";
import { DistanceUnit } from "../../components/utils/DistanceUnit";
import { useReviews } from "../../hooks/doctors/useReviews";
import useGoogleMaps, { Location } from "../../utils/googleMaps/useGoogleMaps";
import { ImageFileOrUrl } from "../Image";
import { DateTime } from "../utils/dateTime";
import { Email } from "../utils/email";
import { ID } from "../utils/id";
import { Phone } from "../utils/phone";
import { Url } from "../utils/url";
import { DoctorReview } from "./review";

export type AbstractLocation = {
    lat?: number;
    lng?: number;
};

export type DoctorLocation = {
    id?: ID;
    hospitalName?: string;
    longAddress?: string;
    shortAddress?: string;
    lat?: number;
    lng?: number;
    phone?: Phone;
    email?: Email;
    website?: Url;
    privateOnly: boolean;
};

export const locationToStr = (location: AbstractLocation) => `location-${Number(location.lat).toFixed(7)}/${Number(location.lng).toFixed(7)}`;

export const sameLocation = (a: AbstractLocation, b: AbstractLocation) => locationToStr(a) === locationToStr(b);

export const newDoctorLocation = (): DoctorLocation => {
    return { privateOnly: false };
};

export const doctorStatuses = ["PENDING_APPROVAL", "APPROVED", "REJECTED", "RETIRED", "PASSED AWAY"] as const;
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
    iCareBetter?: Url;
    nancysNook?: boolean;
    image?: ImageFileOrUrl;
    status?: DoctorStatus;
    addedBy?: UserInfo;
    addedAt?: DateTime;
    approvedAt?: DateTime;
    rejectedAt?: DateTime;
    updatedAt?: DateTime;
    numOfReviews?: number;
    avgRating?: number;
};

export const newDoctor = (): Doctor => {
    return {
        fullName: "",
        gender: "M",
        locations: [],
        specialities: [],
    };
};

export function getDoctorNameWithoutPrefix(doctor: Doctor): string {
    const prefixes = ["prof", "dr"];
    let name = doctor.fullName.toLowerCase();
    if (prefixes.some((prefix) => name.startsWith(prefix))) {
        name = name.slice(name.indexOf(" "));
    }
    return name;
}

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

export function getDoctorReviews(doctor: Doctor) {
    const { data } = useReviews();
    return data.filter((review: DoctorReview) => review.doctor.id === doctor.id);
}

export function getDoctorUrl(doctor: Doctor, onlyMyList = false) {
    return `${onlyMyList ? userSavedProvidersUrl : ""}/${doctor.id}/${doctor.fullName.replaceAll(" ", "-")}}`;
}
