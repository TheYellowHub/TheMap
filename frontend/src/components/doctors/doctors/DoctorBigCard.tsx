import { Doctor } from "../../../types/doctors/doctor";

interface DoctorBigCardProps {
    doctor: Doctor;
    showCard: boolean;
}

function DoctorBigCard({ doctor, showCard }: DoctorBigCardProps) {
    return !showCard ? <></> : <div className="doctorBigCard">{doctor.fullName}</div>;
}

export default DoctorBigCard;
