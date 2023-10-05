import React, { useState, useEffect, useContext, useRef } from "react"
import FileService from "../services/FileService"
import { useLocation, useNavigate } from "react-router-dom"
import { AuthContext } from "../auth-context"

const UpdateFile = () => {
  var navigate = useNavigate()
  var location = useLocation()
  var filename = location.state.filename
  var { userId } = useContext(AuthContext)
  const fileService = new FileService()
  const content = useRef(null)
  var [file, setFile] = useState()
  
  useEffect(() => {
    if (userId === null || filename === undefined) return 
    const body = {
      filename
    }
    fileService.getFile(userId, body)
      .then((_file) => setFile(_file.data))
      .catch((error) => alert(error.response.data))	
  }, [userId, filename]) 
  
  const handleUpdateFile = (event) => {
    event.preventDefault()
    const body = {
      filename,
      content: content.current.value
    }

    fileService.patchFile(userId, body)
      .then(() => {
        navigate('/files/list', { replace: true})
      })
      .catch((error) => alert(error.response.data))	
  }

  return(
    <div className="container">
      <p className="title">Update file</p>
      <form onSubmit={handleUpdateFile}>
        <div className="form-row">
          <div className="input-data">
            <div>File name: {filename}</div>
          </div>
        </div>
        <div className="form-row">
          <div className="input-data">
            <label>Content</label>
            <input ref={content} defaultValue={file?.content} type="text" required/>
          </div>
        </div>
        <div className="submit-button">
          <input type="submit" value="Update"/>
        </div>
      </form>
    </div>
  )
}

export default UpdateFile
