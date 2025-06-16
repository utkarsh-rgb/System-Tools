import { Navigate, useLocation } from "react-router-dom";

const AuthGuard = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("userData") || "null");
  const location = useLocation();
  
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default AuthGuard;
