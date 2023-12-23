import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import ReactGA from "react-ga4";

import MapScreen from "./screens/MapScreen";
import DoctorCategoriesScreen from "./screens/doctors/DoctorCategoriesScreen";
import DoctorSpecialitiesScreen from "./screens/doctors/DoctorSpecialitiesScreen";
import ReviewsScreen from "./screens/ReviewsScreen";
import DoctorsScreen from "./screens/doctors/DoctorsScreen";
import Login from "./auth/Login";
import UserReviews from "./components/reviews/UserReviews";
import { getCurrentUrl } from "./utils/utils";
import IssuesScreen from "./screens/IssuesScreen";

function AppRouter() {
    useEffect(() => {
      ReactGA.send({ hitType: "pageview", title: getCurrentUrl(false)});
    });

    return (
        <Routes>
            <Route path="/:id?/:name?" element={<MapScreen />} />
            <Route path="/admin/doctors" element={<DoctorsScreen />} />
            <Route path="/admin/categories" element={<DoctorCategoriesScreen />} />
            <Route path="/admin/specialities" element={<DoctorSpecialitiesScreen />} />
            <Route path="/admin/reviews" element={<ReviewsScreen />} />
            <Route path="/admin/issues" element={<IssuesScreen />} />
            <Route path="/user/login" element={<Login redirectTo={<MapScreen />} />} />
            <Route path="/user/saved" element={<MapScreen onlyMyList={true} />} />
            <Route path="/user/reviews" element={<UserReviews />} />
        </Routes>
    );
}

export default AppRouter;
