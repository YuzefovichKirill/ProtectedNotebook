import React, { useContext, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./form.css"
import Service from "../Service"
import { AuthContext } from "../auth-context"

const Login = () => {
  const {setUserId} = useContext(AuthContext)

  var navigate = useNavigate()
  const service = new Service()

  const email = useRef(null) 
  const password = useRef(null) 
  const loginForm = {
    email: '',
    password: ''
  }

  const login = (event) => {
    event.preventDefault()
    loginForm.email = email.current.value
    loginForm.password = password.current.value

    service.login(loginForm)
      .then((userId) => {
        setUserId(userId.data)
        navigate('/info' , { replace: true}) 
      })
      .catch((error) => alert(error.response.data))
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