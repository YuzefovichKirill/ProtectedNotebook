import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./auth-context";

const RequireAuth = () => {
  const {userId} = useContext(AuthContext);

  return userId ? <Outlet/> : <Navigate to="/login"/>

}

export default RequireAuth
