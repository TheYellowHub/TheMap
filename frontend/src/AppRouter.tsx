import { Route, Routes } from "react-router-dom";

import MapScreen from "./screens/MapScreen";
import DoctorCategoriesScreen from "./screens/doctors/categories/DoctorCategoriesScreen";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<MapScreen />} />
            <Route path="/doctors/categories" element={<DoctorCategoriesScreen />} />
        </Routes>
    );
}

export default AppRouter;
