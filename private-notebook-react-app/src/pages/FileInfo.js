import React, { useState, useEffect, useContext } from "react"
import FileService from "../services/FileService"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../auth-context"

const FileInfo = () => {
  const navigate = useNavigate()
  var { userId } = useContext(AuthContext)
  var fileName = props.fileName
  const fileService = new FileService()
  var [file, setFile] = useState();
  useEffect(() => {
    if (userId === null || fileName === null) return 
    fileService.getFile(userId, fileName)
      .then(file => setFile(file.data))
      .catch((error) => {
        navigate('/login', {replace: true})
      })	  
  }, [userId, fileName])     

  return(
    <div className="container">
      <p className="title">File Info</p>
      <div className="form-row">
        <div className="input-data">
          <div>File name</div>
          <div>{file?.fileName}</div>
        </div>
      </div>
      <div className="form-row">
        <div className="input-data">
          <div>Info</div>
          <div>{file?.content}</div>
        </div>
      </div>
    </div>
  )
}

export default FileInfo