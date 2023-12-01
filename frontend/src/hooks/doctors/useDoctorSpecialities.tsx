import { DoctorSpeciality } from "../../types/doctors/DoctorSpeciality";
import useApi from "../useApi";

const useDoctorSpecialities = useApi<DoctorSpeciality>("doctors/speciality");

export default useDoctorSpecialities;
