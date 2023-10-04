import { Doctor } from "../../types/doctors/doctor";

export default function getMarkerIcon(doctor: Doctor, isDoctorSelected: boolean, isLocationSelected: boolean) {
    const categoriesIconsMap = new Map();
    categoriesIconsMap.set(/.*pelvic pain.*/, "pp");
    categoriesIconsMap.set(/.*pelvic floor therap.*/, "pft");
    categoriesIconsMap.set(/.*ob.*gyn.*/, "obgyn");

    const dir = isLocationSelected ? "selectedLocation" : isDoctorSelected ? "selectedDoctor" : "notSelected";
    const categoryKeys = Array.from(categoriesIconsMap.keys()).filter((key) =>
        key.test(doctor.category?.toLowerCase())
    );
    const file =
        doctor.iCareBetter !== undefined && doctor.iCareBetter !== ""
            ? "icb"
            : doctor.nancysNook === true
            ? "nn"
            : categoryKeys.length === 1
            ? categoriesIconsMap.get(categoryKeys[0])
            : "default";

    const url = `${window.location.origin}/images/markers/${dir}/${file}.svg`;

    return url;
}
