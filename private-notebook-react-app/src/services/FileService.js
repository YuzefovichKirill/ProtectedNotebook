import axios from "axios";

export default class FileService {
  constructor() {
    this.AuthAPI = axios.create({
      baseURL: "https://localhost:7090/api/files/"
      //baseURL: "https://10.160.19.171:7090/api/files/"
    })
  }

  createFile(id, body) {
    return this.AuthAPI.post(`/${id}`, body)
  }

  getFile(id, body) {
    return this.AuthAPI.put(`/${id}`, body)
  }

  getFileList(id) {
    return this.AuthAPI.get(`/${id}`)
  }

  patchFile(id, body) {
    return this.AuthAPI.patch(`/${id}`, body)
  }

  deleteFile(id, body) {
    return this.AuthAPI.delete(`/${id}`, body)
  }
}