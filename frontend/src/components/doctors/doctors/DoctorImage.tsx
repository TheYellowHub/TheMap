import { useState } from "react";
import { Doctor } from "../../../types/doctors/doctor";

interface DoctorImageProps {
    doctor: Doctor;
}

function DoctorImage({ doctor }: DoctorImageProps) {
    const [error, setError] = useState(false);

    const image = doctor.image && !error
        ? doctor.image.toString()
        : `/images/default-doctor-${doctor.gender === "F" ? "f" : "m"}.png`
    return (
        <img onError={() => setError(true)} className="doctor-image" src={image} alt={doctor.fullName} />
    );
}

export default DoctorImage;
