import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateFile from "./pages/CreateFile"
import UpdateFile from "./pages/UpdateFile"
import FileInfo from "./pages/FileInfo"
import FileList from "./pages/FileList"

import Navbar from "./navbar";
import AuthProvider from "./auth-context";
import RequireAuth from "./RequireAuth";
import RSAProvider from "./rsa-context";

function App() {
  return (
    <RSAProvider>
      <AuthProvider>
        <Router>
          <Navbar/>
          <Routes>
            <Route path="/login" element={<Login />} exact/>
            <Route path="/register" element={<Register />} exact/>
            
            <Route element={<RequireAuth/>}>
              <Route path="files/create" element={<CreateFile/>} exact/>
              <Route path="files/list" element={<FileList />} exact/>
              <Route path="files/update" element={<UpdateFile />} exact/>
              <Route path="files/info" element={<FileInfo />} exact/>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </RSAProvider>
  );
}

export default App;
