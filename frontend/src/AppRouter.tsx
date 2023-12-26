import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import MapScreen from "./screens/MapScreen";
import DoctorCategoriesScreen from "./screens/doctors/DoctorCategoriesScreen";
import DoctorSpecialitiesScreen from "./screens/doctors/DoctorSpecialitiesScreen";
import ReviewsScreen from "./screens/ReviewsScreen";
import DoctorsScreen from "./screens/doctors/DoctorsScreen";
import Login from "./auth/Login";
import UserReviews from "./components/reviews/UserReviews";
import IssuesScreen from "./screens/IssuesScreen";
import DeleteAccountModal from "./auth/DeleteAccountModal";
import { logPageView } from "./utils/log";

export const mainMapUrl = "/";
export const userSavedProvidersUrl = "/user/saved";

function AppRouter() {
    useEffect(() => {
        logPageView();
    });

    return (
        <Routes>
            <Route path={`${mainMapUrl}:doctorId?/:name?/:locationId?`} element={<MapScreen />} />
            <Route path="/admin/doctors" element={<DoctorsScreen />} />
            <Route path="/admin/categories" element={<DoctorCategoriesScreen />} />
            <Route path="/admin/specialities" element={<DoctorSpecialitiesScreen />} />
            <Route path="/admin/reviews" element={<ReviewsScreen />} />
            <Route path="/admin/issues" element={<IssuesScreen />} />
            <Route path="/user/login" element={<Login />} />
            <Route path={userSavedProvidersUrl} element={<MapScreen onlyMyList={true} />} />
            <Route path="/user/saved/:doctorId?/:name?/:locationId?" element={<MapScreen onlyMyList={true} />} />
            <Route path="/user/reviews" element={<UserReviews />} />
            <Route path="/user/delete" element={<DeleteAccountModal show={true} onHide={() => {}} />} />
        </Routes>
    );
}

export default AppRouter;
