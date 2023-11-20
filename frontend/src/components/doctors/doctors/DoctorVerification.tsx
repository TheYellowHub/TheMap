import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { Doctor } from "../../../types/doctors/doctor";

interface DoctorVerificationProps {
    doctor: Doctor;
}

function DoctorVerification({ doctor }: DoctorVerificationProps) {
    return (
        <span className="verification text-nowrap">
            {doctor.nancysNook && (
                <OverlayTrigger placement="bottom" overlay={<Tooltip>Nancy&apos;s Nook</Tooltip>}>
                    <img className="px-1" src="images/NN.svg" alt="Nancy's Nook" />
                </OverlayTrigger>
            )}
            {doctor.iCareBetter && (
                <OverlayTrigger placement="bottom" overlay={<Tooltip>iCareBetter.com</Tooltip>}>
                    <a href={doctor.iCareBetter} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                        <img className="px-1" src="images/iCareBetter.svg" alt="iCareBetter.com" />
                    </a>
                </OverlayTrigger>
            )}
        </span>
    );
}
export default DoctorVerification;
