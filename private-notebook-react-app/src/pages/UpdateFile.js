import React, { useState, useEffect, useContext, useRef } from "react"
import FileService from "../services/FileService"
import { useLocation, useNavigate } from "react-router-dom"
import { AuthContext } from "../auth-context"
import { RSAContext } from "../rsa-context"
import { RSADecrypt } from "../crypto/RSA"
import Serpent from "../crypto/Serpent"

const UpdateFile = () => {
  var navigate = useNavigate()
  var location = useLocation()
  var filename = location.state.filename
  var { jwtToken } = useContext(AuthContext)
  const { RSAKey, RSAModule } = useContext(RSAContext)
  const fileService = new FileService()
  const content = useRef(null)
  var [file, setFile] = useState()
  
  useEffect(() => {
    if (jwtToken === null || filename === undefined) return 
    const body = {
      filename
    }
    fileService.getFile(body)
      .then((_file) => {
        const sessionKey = RSADecrypt(_file.data.sessionKey, RSAKey, RSAModule)
        var serpent = new Serpent()
        const content = serpent.Decrypt(sessionKey, _file.data.iv, _file.data.content)
        setFile(content)
      })
      .catch((error) => alert(error.response.data))	
  }, [filename]) 
  
  const handleUpdateFile = (event) => {
    event.preventDefault()
    const body = {
      filename,
      content: content.current.value
    }

    fileService.patchFile(body)
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
            <input ref={content} defaultValue={file} type="text" required/>
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
