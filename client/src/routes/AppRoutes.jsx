import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Categories from "../pages/categories/Categories";
import Transactions from "../pages/transactions/Transactions";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import ForgotPassword from "../pages/auth/ForgotPassword";
import OtpVerification from "../pages/auth/OtpVerification";
import ResetPassword from "../pages/auth/ResetPassword";
import Profile from "../pages/profile/Profile";
import Welcome from "../pages/welcome/Welcome";
import UpdateProfile from "../pages/profile/UpdateProfile";
import ChangePassword from "../pages/profile/ChangePassword";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />}></Route>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/categories" element={<Categories />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/update" element={<UpdateProfile />} />
          <Route path="/profile/change-password" element={<ChangePassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
