import React, { useContext } from 'react'
import './navbar.css'
import { NavLink } from "react-router-dom";
import { AuthContext } from './auth-context';

const Navbar = () => {
  const { userId, setUserId } = useContext(AuthContext)
  const removeUser = () => {
    setUserId(null)
  } 

  return (
    <nav>
      <div className='link-group'>
        <NavLink className="nav-link" to='login'>
          Login
        </NavLink>
        <NavLink className="nav-link" to='register'>
          Register
        </NavLink>
        <NavLink className="nav-link" to='files/list'>
          Notebooks
        </NavLink>

        {(userId !== null) && <button onClick={removeUser}>Logout</button>}
      </div>
    </nav>
  )
}

export default Navbar