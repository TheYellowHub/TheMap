import { Doctor } from "../../../types/doctors/doctor";

interface DoctorSmallCardProps {
    doctor: Doctor;
    onClick: () => void;
}

function DoctorSmallCard({ doctor, onClick }: DoctorSmallCardProps) {
    const image = doctor.image
        ? doctor.image.name
        : "images/default-doctor-f.png";
    const address = doctor.locations[0] ? doctor.locations[0].address ? doctor.locations[0].address : "no address" : "no location";
    // TODO: replace with the real fields
    const averageRating = 4.5;
    const totalReviews = 10;
    return (
        <div className="doctorSmallCard" onClick={onClick}>
            <img src={image} alt={doctor.fullName} />
            <div className="doctorSmallCardData">
                <div><h5>{doctor.fullName} </h5></div>
                <div> {doctor.categories}</div>
                <div> {address}</div>
                <div>
                    {averageRating} {totalReviews}
                </div>
            </div>
        </div>
    );
}

export default DoctorSmallCard;
