import { DoctorCategory } from "../../types/doctors/doctorCategory";
import useApi from "../useApi";

const useDoctorCategories = useApi<DoctorCategory>("doctors/category");

export default useDoctorCategories;
