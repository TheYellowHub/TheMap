import { Col } from "react-bootstrap";
import useAuth from "../../../auth/useAuth";
import useUser from "../../../hooks/auth/useUsers";
import { Doctor } from "../../../types/doctors/doctor";
import Icon from "../../utils/Icon";
import Tooltip from "../../utils/Tooltip";
import { logEvent } from "../../../utils/log";

interface SaveDoctorIconProps {
    doctor: Doctor;
    colClassName: string;
    iconClassName?: string;
}

export default function SaveDoctorIcon({doctor, colClassName, iconClassName} : SaveDoctorIconProps) {
    const { user, isAuthenticated, login } = useAuth();
    const { userInfo, mutateSavedDoctors } = useUser(user); // TODO: handle mutation errors?
    const icon = <Icon
        icon={`fa-bookmark fa-sm ${userInfo?.savedDoctors?.includes(doctor.id!) === true ? "fa-solid" : "fa-regular"}`}
        className={iconClassName}
        padding={false}
        onClick={(e) => {
            e.stopPropagation();
            if (user && isAuthenticated) {
                mutateSavedDoctors(doctor.id!);
            } else {
                logEvent("Add a bookmark - new user (redirection to login)", "Bookmarks");
                login();
            }
        }} 
    />;

    return (
        <Col className={colClassName} xs="auto">
            {userInfo?.savedDoctors?.includes(doctor.id!) 
                ? <Tooltip text="Remove from my list">{icon}</Tooltip>
                : <Tooltip text="Add to my list">{icon}</Tooltip>
            }
        </Col>
    );
}