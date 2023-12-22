import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import ReactGA from "react-ga4";

import MapScreen from "./screens/MapScreen";
import DoctorCategoriesScreen from "./screens/doctors/DoctorCategoriesScreen";
import DoctorSpecialitiesScreen from "./screens/doctors/DoctorSpecialitiesScreen";
import ReviewsScreen from "./screens/ReviewsScreen";
import DoctorsScreen from "./screens/doctors/DoctorsScreen";
import Login from "./auth/Login";
import UserReviewsForm from "./components/reviews/UserReviewsForm";
import useAuth from "./auth/useAuth";
import useUser from "./hooks/auth/useUsers";
import { getCurrentUrl } from "./utils/utils";

function AppRouter() {
    const { user } = useAuth();
    const { userInfo } = useUser(user);

    useEffect(() => {
      ReactGA.send({ hitType: "pageview", title: getCurrentUrl(false)});
    }, []);

    return (
        <Routes>
            <Route path="/:id?/:name?" element={<MapScreen />} />
            <Route path="/admin/doctors" element={<DoctorsScreen />} />
            <Route path="/admin/categories" element={<DoctorCategoriesScreen />} />
            <Route path="/admin/specialities" element={<DoctorSpecialitiesScreen />} />
            <Route path="/admin/reviews" element={<ReviewsScreen />} />
            <Route path="/user/login" element={<Login redirectTo={<MapScreen />} />} />
            <Route path="/user/saved" element={<MapScreen onlyMyList={true} />} />
            <Route path="/user/reviews" element={<UserReviewsForm userInfo={userInfo!} />} />
        </Routes>
    );
}

export default AppRouter;
