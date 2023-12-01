import { UserInfo } from "../../auth/userInfo";
import { Doctor } from "../../types/doctors/doctor";
import { DoctorReview } from "../../types/doctors/review";
import useApi from "../useApi";

const urlDirectory = "doctors/review";
const doctorParam = (doctor?: Doctor) => (doctor?.id ? `&doctor__id=${doctor.id}` : "");
const userParam = (userInfo?: UserInfo) => (userInfo?.remoteId ? `&added_by__remote_id=${userInfo.remoteId}` : "");

export const useAllReviews = () => useApi<DoctorReview>(urlDirectory)();

export const useDoctorReviews = (doctor: Doctor) => useApi<DoctorReview>(urlDirectory, `?${doctorParam(doctor)}`)();

export const useUserReviews = (userInfo: UserInfo, doctor?: Doctor) =>
    useApi<DoctorReview>(urlDirectory, `?${userParam(userInfo)}${doctorParam(doctor)}`)();
