import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./auth-context";

const RequireAuth = () => {
  const { jwtToken } = useContext(AuthContext);

  return jwtToken ? <Outlet/> : <Navigate to="/login"/>

}

export default RequireAuth
