import React, { useContext } from 'react'
import './navbar.css'
import { NavLink } from "react-router-dom";
import { AuthContext } from './auth-context';
import { RSAContext } from './rsa-context';
import { genKey, defaultLength } from './crypto/RSA'
import AuthService from './services/AuthService'

const Navbar = () => {
  const { userId, setUserId } = useContext(AuthContext)
  const { setRSAKey, setRSAModule } = useContext(RSAContext)
  const authService = new AuthService()

  const removeUser = (event) => {
    event.preventDefault()
    setUserId(null)
  } 

  const changeRSAKeys = (event) => {
    event.preventDefault()
    var { e, n, d } = genKey(defaultLength)
    const body = {
      RSAKey: e,
      module: n
    }
    setRSAKey(d)
    setRSAModule(n)
    authService.changeRSAKey(userId, body)
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
        {(userId !== null) && <button onClick={changeRSAKeys}>Change RSA keys</button>}
      </div>
    </nav>
  )
}

export default Navbar