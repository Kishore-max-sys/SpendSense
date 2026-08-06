import { Navigate, Outlet } from "react-router-dom";
import useVerifyUser from "../hooks/useVerifyUser";

function ProtectedRoute() {
  const { isLoading, isVerified } = useVerifyUser();
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (!isVerified) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
