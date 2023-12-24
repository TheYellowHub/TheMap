import { Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import useAuth from "../../../auth/useAuth";
import useUser from "../../../hooks/auth/useUsers";
import { Doctor } from "../../../types/doctors/doctor";
import Icon from "../../utils/Icon";

interface SaveDoctorIconProps {
    doctor: Doctor;
    colClassName: string;
    iconClassName?: string;
}

export default function SaveDoctorIcon({doctor, colClassName, iconClassName} : SaveDoctorIconProps) {
    const { user, isAuthenticated, login } = useAuth();
    const { userInfo, mutateSavedDoctors } = useUser(user); // TODO: handle mutation errors?

    return (
        
        <OverlayTrigger
            placement="top-end"
            overlay={
                <Tooltip className="tooltip">
                    {userInfo?.savedDoctors?.includes(doctor.id!)
                        ? "Remove from my list"
                        : "Add to my list"}
                </Tooltip>
            }
        >
            <Col className={colClassName} xs="auto">
                <Icon
                icon="fa-bookmark fa-sm"
                className={iconClassName}
                solid={userInfo?.savedDoctors?.includes(doctor.id!) === true}
                onClick={(e) => {
                    e.stopPropagation();
                    if (user && isAuthenticated) {
                        mutateSavedDoctors(doctor.id!);
                    } else {
                        login();
                    }
                }} />
            </Col>
        </OverlayTrigger>
    )
}