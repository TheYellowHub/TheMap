import { Route, Routes } from "react-router-dom";

import MapScreen from "./screens/MapScreen";
import DoctorCategoriesScreen from "./screens/doctors/DoctorCategoriesScreen";
import DoctorSpecialitiesScreen from "./screens/doctors/DoctorSpecialitiesScreen";
import DoctorsScreen from "./screens/doctors/DoctorsScreen";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<MapScreen />} />
            <Route path="/doctors/doctors" element={<DoctorsScreen />} />
            <Route path="/doctors/categories" element={<DoctorCategoriesScreen />} />
            <Route path="/doctors/specialities" element={<DoctorSpecialitiesScreen />} />
        </Routes>
    );
}

export default AppRouter;
