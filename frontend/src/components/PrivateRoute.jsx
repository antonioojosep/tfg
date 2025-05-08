import { Navigate } from "react-router-dom";
import { use } from "react";
import AuthContext from "../context/Authcontext";

export default function PrivateRoute({ children }) {
  const { isAuthenticated } = use(AuthContext);

  return isAuthenticated ? children : <Navigate to="/" />;
}
