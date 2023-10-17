import { Doctor } from "../../../types/doctors/doctor";

interface DoctorImageProps {
    doctor: Doctor;
}

function DoctorImage({ doctor }: DoctorImageProps) {
    const image = doctor.image
        ? doctor.image.toString()
        : doctor.gender === "F"
        ? "images/default-doctor-f.png"
        : "images/default-doctor-m.png";
    return (
        <img className="doctorSmallCardImg" src={image} alt={doctor.fullName} />
    );
}

export default DoctorImage;
