import React, { useState, useEffect, useContext } from "react"
import FileService from "../services/FileService"
import { useLocation } from "react-router-dom"
import { AuthContext } from "../auth-context"

const FileInfo = () => {
  var location = useLocation()
  var filename = location.state.filename
  var { userId } = useContext(AuthContext)
  const fileService = new FileService()
  var [file, setFile] = useState();
  
  useEffect(() => {
    if (userId === null || filename === undefined) return 
    const body = {
      filename
    }
    fileService.getFile(userId, body)
      .then(_file => setFile(_file.data))
      .catch((error) => {
        alert(JSON.stringify(error))
      })
  }, [userId, filename])

  return(
    <div className="container">
      <p className="title">File Info</p>
      <div className="form-row">
        <div className="input-data">
          <div>File name</div>
          <div>{filename}</div>
        </div>
      </div>
      <div className="form-row">
        <div className="input-data">
          <div>Content</div>
          <div>{file?.content}</div>
        </div>
      </div>
    </div>
  )
}

export default FileInfo