import { DoctorReview } from "../../types/doctors/review";
import useApi from "../useApi";

const urlDirectory = "doctors/review";

export const useReviews = () => useApi<DoctorReview>(urlDirectory)();
