import { Doctor } from "../../../types/doctors/doctor";
import Tooltip from "../../utils/Tooltip";

interface DoctorVerificationProps {
    doctor: Doctor;
}

function DoctorVerification({ doctor }: DoctorVerificationProps) {
    return (
        <span className="verification text-nowrap">
            {doctor.nancysNook && (
                <Tooltip text="Nancy&apos;s Nook">
                    <img className="px-1" src="/images/NN.svg" alt="Nancy's Nook" />
                </Tooltip>
            )}
            {doctor.iCareBetter && (
                <Tooltip text="iCareBetter.com">
                    <a href={doctor.iCareBetter} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                        <img className="px-1" src="/images/iCareBetter.svg" alt="iCareBetter.com" />
                    </a>
                </Tooltip>
            )}
        </span>
    );
}
export default DoctorVerification;
