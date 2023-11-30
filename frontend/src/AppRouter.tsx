import { Route, Routes } from "react-router-dom";

import MapScreen from "./screens/MapScreen";
import DoctorCategoriesScreen from "./screens/doctors/DoctorCategoriesScreen";
import DoctorSpecialitiesScreen from "./screens/doctors/DoctorSpecialitiesScreen";
import ReviewsScreen from "./screens/ReviewsScreen";
import DoctorsScreen from "./screens/doctors/DoctorsScreen";
import Login from "./auth/Login";
import UserReviewsForm from "./components/reviews/UserReviewsForm";
import useAuth from "./auth/useAuth";
import useUser from "./hooks/auth/useUsers";

function AppRouter() {
    const { user } = useAuth();
    const { userInfo } = useUser(user);

    return (
        <Routes>
            <Route path="/:id?" element={<MapScreen startWithMyList={false} />} />
            <Route path="/admin/doctors" element={<DoctorsScreen />} />
            <Route path="/admin/categories" element={<DoctorCategoriesScreen />} />
            <Route path="/admin/specialities" element={<DoctorSpecialitiesScreen />} />
            <Route path="/admin/reviews" element={<ReviewsScreen />} />
            <Route path="/user/login" element={<Login redirectTo={<MapScreen />} />} />
            <Route path="/user/saved" element={<MapScreen startWithMyList={true} />} />
            <Route path="/user/reviews" element={<UserReviewsForm userInfo={userInfo!} />} />
        </Routes>
    );
}

export default AppRouter;
