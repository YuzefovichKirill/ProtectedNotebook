import React, { useRef, useContext } from "react"
import { useNavigate } from "react-router-dom"
import "./form.css"
import AuthService from "../services/AuthService"
import { AuthContext } from "../auth-context"

const Register = () => {
  const {setUserId} = useContext(AuthContext)

  var navigate = useNavigate()
  const authService = new AuthService()
  const email = useRef(null) 
  const password = useRef(null) 
  const confirmPassword = useRef(null) 
  const registerForm = {
    email: '',
    password: ''
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