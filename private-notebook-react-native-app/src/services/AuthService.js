import axios from "axios";

export default class AuthService {
  constructor() {
    this.AuthAPI = axios.create({
      baseURL: "https://localhost:7090/api/auth/"
      //baseURL: "https://10.160.19.171:7090/api/auth/"
    })
    
  }
  
  register(body) {
    return this.AuthAPI.post('register', body)
  }

  login(body) {
    return this.AuthAPI.post('login', body)
  }

  changeRSAKey(id, body) {
    return this.AuthAPI.patch(`change-rsa-key/${id}`, body)
  }
}