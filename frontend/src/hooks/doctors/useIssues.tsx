import { DoctorIssue } from "../../types/doctors/issue";
import useApi from "../useApi";

const urlDirectory = "doctors/issue";

export const useIssues = () => useApi<DoctorIssue>(urlDirectory)();
