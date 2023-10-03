import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Info from "./pages/Info";

import Navbar from "./navbar";
import AuthProvider from "./auth-context";
import RequireAuth from "./RequireAuth";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/login" element={<Login />} exact/>
          <Route path="/register" element={<Register />} exact/>
          
          <Route element={<RequireAuth/>}>
            <Route path="files/create" element={<div />} exact/>
            <Route path="files/list" element={<div />} exact/>
            <Route path="files/update" element={<div />} exact/>
            <Route path="files/info" element={<div />} exact/>
            
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
