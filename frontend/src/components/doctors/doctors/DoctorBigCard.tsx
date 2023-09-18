import { Modal as ReactModal } from "react-bootstrap";

import { Doctor } from "../../../types/doctors/doctor";

interface DoctorBigCardProps {
    doctor: Doctor;
    show: boolean;
    onClose: () => void;
}

function DoctorBigCard({ doctor, show, onClose }: DoctorBigCardProps) {
    // TODO: design

    // TODO: replace with the real fields
    const averageRating = 4.5;
    const reviews = [
        {
            user: "Hana",
            content: "bla bla bla",
            rating: 4,
        },
        {
            user: "Brandon",
            content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sapien consectetur cursus a, nulla at convallis. Adipiscing mattis commodo eget est, pellentesque ipsum viverra congue. Blandit consectetur mattis commodo eget est, pellentesque ipsum",
            rating: 5,
        },
    ];

    return (
        <ReactModal className="doctorBigCard" show={show} onHide={onClose} centered>
            {JSON.stringify(doctor)}
        </ReactModal>
    );
}

export default DoctorBigCard;
