import { Route, Routes } from "react-router-dom";

import MapScreen from "./screens/MapScreen";
import DoctorCategoriesScreen from "./screens/doctors/DoctorCategoriesScreen";
import DoctorSpecialitiesScreen from "./screens/doctors/DoctorSpecialitiesScreen";
import DoctorsScreen from "./screens/doctors/DoctorsScreen";
import Login from "./auth/Login";

function AppRouter() {
    return (
        <Routes>
            <Route path="/:id?" element={<MapScreen startWithMyList={false} />} />
            <Route path="/doctors/doctors" element={<DoctorsScreen />} />
            <Route path="/doctors/categories" element={<DoctorCategoriesScreen />} />
            <Route path="/doctors/specialities" element={<DoctorSpecialitiesScreen />} />
            <Route path="/user/login" element={<Login redirectTo={<MapScreen />} />} />
            <Route path="/user/saved" element={<MapScreen startWithMyList={true} />} />
        </Routes>
    );
}

export default AppRouter;
