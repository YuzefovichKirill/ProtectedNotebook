import React, { useState, useEffect, useContext } from "react"
import FileService from "../services/FileService"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../auth-context"

const FileList = () => {
  const navigate = useNavigate()
  var { userId } = useContext(AuthContext)
  const fileService = new FileService()
  var [filenames, setFilenames] = useState();
  
  useEffect(() => {
    if (userId === null) return 
    fileService.getFileList(userId)
      .then(_filenames => setFilenames(_filenames.data))
      .catch((error) => {
        navigate('/login', {replace: true})
      })	  
  }, [userId])     

  return(
    <div className="container">
      <p className="title">Files names</p>
      {filenames.map(name => {
        return (
          <div className="form-row">
            <div className="input-data">
              <div>File name: {name}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default FileList