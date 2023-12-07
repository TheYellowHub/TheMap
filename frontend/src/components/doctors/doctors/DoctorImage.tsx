import { Doctor } from "../../../types/doctors/doctor";

interface DoctorImageProps {
    doctor: Doctor;
    big: boolean;
}

function DoctorImage({ doctor, big = false }: DoctorImageProps) {
    const image = doctor.image
        ? doctor.image.toString().replaceAll("//", "/")
        : doctor.gender === "F"
        ? "images/default-doctor-f.png"
        : "images/default-doctor-m.png";
    return (
        <img className={big === true ? "doctorBigCardImg" : "doctorSmallCardImg"} src={image} alt={doctor.fullName} />
    );
}

export default DoctorImage;
