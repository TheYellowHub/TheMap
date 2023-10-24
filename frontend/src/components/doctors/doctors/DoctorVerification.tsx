import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { Doctor } from "../../../types/doctors/doctor";

function DoctorVerification({ doctor }: { doctor: Doctor }) {
    return (
        <span className="verification text-nowrap">
            {doctor.nancysNook && (
                <img
                    className="px-1"
                    src="images/nancynook.png"
                    alt="nancy nook"
                />
            )}
            {doctor.iCareBetter && (
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>View Profile</Tooltip>}
                >
                    <a
                        href={doctor.iCareBetter}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            className="px-1"
                            src="images/icarebetter.png"
                            alt="iCareBetter"
                        />
                    </a>
                </OverlayTrigger>
            )}
        </span>
    );
}
export default DoctorVerification;
