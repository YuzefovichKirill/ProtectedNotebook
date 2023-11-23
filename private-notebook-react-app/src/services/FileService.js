import privateNotebookAPIInstance from "../auth-interceptor";

export default class FileService {
  constructor() {
    this.AuthAPI = privateNotebookAPIInstance
  }

  createFile(body) {
    return this.AuthAPI.post(`files`, body)
  }

  getFile(body) {
    return this.AuthAPI.put(`files`, body)
  }

  getFileList() {
    return this.AuthAPI.get(`files`)
  }

  patchFile(body) {
    return this.AuthAPI.patch(`files`, body)
  }

  deleteFile(filename) {
    return this.AuthAPI.delete(`files/${filename}`)
  }
}