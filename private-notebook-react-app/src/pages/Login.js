import React, { useContext, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./form.css"
import { AuthContext } from "../auth-context"
import { RSAContext } from '../rsa-context';
import { genKey, defaultLength } from '../crypto/RSA'
import AuthService from "../services/AuthService"

const Login = () => {
  const { setJwtToken } = useContext(AuthContext)
  const { setRSAKey, setRSAModule } = useContext(RSAContext)
  var navigate = useNavigate()
  const authService = new AuthService()

  const email = useRef(null) 
  const password = useRef(null) 
  const loginForm = {
    email: '',
    password: ''
  }

  const changeRSAKeys = () => {
    var { e, n, d } = genKey(defaultLength)
    const body = {
      RSAKey: e,
      module: n
    }
    setRSAKey(d)
    setRSAModule(n)
    authService.changeRSAKey(body)
  }

  const login = (event) => {
    event.preventDefault()
    loginForm.email = email.current.value
    loginForm.password = password.current.value

    console.log(1)
    authService.login(loginForm)
      .then((jwtToken) => {
        console.log(2)
        setJwtToken(jwtToken.data)
        changeRSAKeys()
        navigate('/files/list' , { replace: true}) 
      })
      //.catch((error) => alert(error.response.data))
      .catch((error) => alert(JSON.stringify(error)))
    console.log(3)
  }

  return (
    <div className="container">
      <p className="title">Login</p>
      <form onSubmit={login}>
        <div className="form-row">
          <div className="input-data">
            <label>Email</label>
            <input ref={email} type="email" required/>
          </div>
        </div>
        <div className="form-row">
          <div className="input-data">
            <label>Password</label>
            <input ref={password} minLength={8} type="password" required/>
          </div>
        </div>
        <div className="submit-button">
          <input type="submit" value="Submit"/>
        </div>
      </form>
    </div>
  )
}

export default Login
