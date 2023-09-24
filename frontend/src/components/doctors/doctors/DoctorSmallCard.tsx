import { Doctor } from "../../../types/doctors/doctor";

interface DoctorSmallCardProps {
    doctor: Doctor;
    onClick: () => void;
}

function DoctorSmallCard({ doctor, onClick }: DoctorSmallCardProps) {
    return (
        <div className="doctorSmallCard" onClick={onClick}>
            {doctor.fullName}
            <br />
            {doctor.categories}
        </div>
    );
}

export default DoctorSmallCard;
