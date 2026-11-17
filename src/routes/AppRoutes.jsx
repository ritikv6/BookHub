import { Routes, Route } from "react-router-dom";
import Books from "../pages/Books/Books";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";

function AppRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout/>}>
            <Route path="/" element={<Home/>}/>
            <Route path="/books" element={<Books />} />
            </Route>
        </Routes>
    );
}
export default AppRoutes;