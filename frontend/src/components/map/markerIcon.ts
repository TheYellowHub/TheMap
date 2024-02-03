import { Doctor } from "../../types/doctors/doctor";

type MarkerIcon = {
    predicate: (doctor: Doctor) => boolean,
    title: string,
    imgFileName: string; 
    order?: number;
};

const doctorHasCategory = (categoryKey: RegExp) => 
    (doctor: Doctor) => doctor.category ? categoryKey.test(doctor.category.toLowerCase()) : false;

export const markerIcons: MarkerIcon[] = [
    {
        predicate: (doctor: Doctor) => doctor.iCareBetter ? doctor.iCareBetter !== "" : false, 
        title: "icarebetter Vetted", 
        imgFileName: "icb"
    },
    {
        predicate: (doctor: Doctor) => doctor.nancysNook === true, 
        title: "Nancy’s Nook List", 
        imgFileName: "nn"
    },
    {
        predicate: doctorHasCategory(/.*ob.*gyn.*/), 
        title: "Endo-friendly OB/GYN", 
        imgFileName: "obgyn"
    },
    {
        predicate: doctorHasCategory(/.*pelvic floor therap.*/), 
        title: "Pelvic Floor Therapist", 
        imgFileName: "pft"
    },
    {
        predicate: doctorHasCategory(/.*pelvic pain.*/), 
        title: "Pelvic Pain Specialist", 
        imgFileName: "pp"
    },
    {
        predicate: doctorHasCategory(/.*surgeon.*/), 
        title: "Excision Surgeon", 
        imgFileName: "default",
        order: 1
    },
];

export function getMarkerIconDir(isDoctorSelected: boolean, isLocationSelected: boolean) {
    return isLocationSelected ? "selectedLocation" : isDoctorSelected ? "selectedDoctor" : "notSelected";
}

export function getMarkerIconFile(doctor: Doctor) {
    for (const markerIcon of markerIcons) {
        if (markerIcon.predicate(doctor)) {
            return markerIcon.imgFileName;
        }
    }
    return markerIcons.at(-1)!.imgFileName;
}

export function getMarkerIconUrl(dir: string, imgFileName: string) {
    return `/images/markers/${dir}/${imgFileName}.svg`;
}

export function getDoctorMarkerIcon(doctor: Doctor, isDoctorSelected: boolean, isLocationSelected: boolean) {
    const dir = getMarkerIconDir(isDoctorSelected, isLocationSelected);
    const imgFileName = getMarkerIconFile(doctor);
    return getMarkerIconUrl(dir, imgFileName);
}

export function getGroupMarkerIcon(selected: boolean) {
    return `/images/markers/${selected ? "selectedGroup" : "notSelected/group"}.svg`;
}
