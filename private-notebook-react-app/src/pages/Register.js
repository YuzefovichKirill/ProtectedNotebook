import React, { useRef, useContext } from "react"
import { useNavigate } from "react-router-dom"
import "./form.css"
import { AuthContext } from "../auth-context"
import { RSAContext } from '../rsa-context';
import { genKey, defaultLength } from '../crypto/RSA'
import AuthService from "../services/AuthService"

const Register = () => {
  const {setUserId} = useContext(AuthContext)
  const { setRSAKey, setRSAModule } = useContext(RSAContext)
  var navigate = useNavigate()
  const authService = new AuthService()

  const email = useRef(null) 
  const password = useRef(null) 
  const confirmPassword = useRef(null) 
  const registerForm = {
    email: '',
    password: ''
  }

  const changeRSAKeys = (userId) => {
    var { e, n, d } = genKey(defaultLength)
    const body = {
      RSAKey: e,
      module: n
    }
    setRSAKey(d)
    setRSAModule(n)
    authService.changeRSAKey(userId, body)
  }

  const register = (event) =>{
    event.preventDefault()
    registerForm.email = email.current.value
    registerForm.password = password.current.value
  
    if (password.current.value !== confirmPassword.current.value){
      alert("password doesn't match confirm password")
      return
    }

    authService.register(registerForm)
      .then((userId) => {
        setUserId(userId.data)
        changeRSAKeys(userId.data)
        navigate('/files/list' , { replace: true})  
      })
      .catch((error) => alert(error.response.data))	
  }

  return (
    <div className="container">
      <p className="title">Register</p>
      <form onSubmit={register}>
        <div className="form-row">
          <div className="input-data">
            <label>Email</label>
            <input ref={email} type="email" required/>
          </div>
        </div>
        <div className="form-row">
          <div className="input-data">
            <label>Password</label>
            <input ref={password} type="password" minLength={8} required/>
          </div>
        </div>
        <div className="form-row">
          <div className="input-data">
            <label>Confirm Password</label>
            <input ref={confirmPassword} type="password" minLength={8} required/>
          </div>
        </div>
        <div className="submit-button">
          <input type="submit" value="Submit"/>
        </div>
      </form>
    </div>
  )
}

export default Register