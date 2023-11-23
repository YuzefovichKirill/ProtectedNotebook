import privateNotebookAPIInstance from "../auth-interceptor";

export default class AuthService {
  constructor() {
    this.AuthAPI = privateNotebookAPIInstance
  }
  
  register(body) {
    return this.AuthAPI.post('auth/register', body)
  }

  login(body) {
    return this.AuthAPI.post('auth/login', body)
  }

  changeRSAKey(body) {
    return this.AuthAPI.patch(`auth/change-rsa-key`, body)
  }
}