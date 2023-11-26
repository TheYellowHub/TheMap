import { Doctor } from "../../types/doctors/doctor";
import useApi from "../useApi";

const useDoctors = useApi<Doctor>("doctors/doctor");

export default useDoctors;
