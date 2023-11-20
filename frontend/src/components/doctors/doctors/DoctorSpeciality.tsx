import Icon from "../../utils/Icon";

interface DoctorSpecialityProps {
    speciality?: string;
}

function DoctorSpeciality({ speciality }: DoctorSpecialityProps) {
    if (speciality) {
        return (
            <div className="doctorSpecialityRibbon text-black text-nowrap dark-grey">
                <Icon icon="fa-check" />
                {speciality}
            </div>
        );
    } else {
        return <></>;
    }
}
export default DoctorSpeciality;
