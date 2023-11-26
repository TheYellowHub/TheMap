import { UserInfo } from "../../auth/userInfo";
import { Doctor } from "../../types/doctors/doctor";
import { DoctorReview } from "../../types/doctors/review";
import useApi from "../useApi";

const urlDirectory = "doctors/review";

export const useAllReviews = () => useApi<DoctorReview>(urlDirectory);

export const useDoctorReviews = (doctor: Doctor) => useApi<DoctorReview>(urlDirectory, `?&doctor__id=${doctor.id}`);

export const useUserReviews = (userInfo: UserInfo) =>
    useApi<DoctorReview>(urlDirectory, `?&added_by__remote_id=${userInfo.remoteId}`);
