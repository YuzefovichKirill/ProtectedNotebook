import React, { useState, useEffect, useContext } from "react"
import FileService from "../services/FileService"
import { useLocation } from "react-router-dom"
import { AuthContext } from "../auth-context"
import { RSAContext } from "../rsa-context"
import { RSADecrypt } from "../crypto/RSA"
import Serpent from "../crypto/Serpent"

const FileInfo = () => {
  var location = useLocation()
  var filename = location.state.filename
  var { jwtToken } = useContext(AuthContext)
  const { RSAKey, RSAModule } = useContext(RSAContext)
  const fileService = new FileService()
  var [file, setFile] = useState();
  
  useEffect(() => {
    if (jwtToken === null || filename === undefined) return 
    const body = {
      filename
    }
    fileService.getFile(body)
      .then(_file => {      
        const sessionKey = RSADecrypt(_file.data.sessionKey, RSAKey, RSAModule)
        var serpent = new Serpent()
        const content = serpent.Decrypt(sessionKey, _file.data.iv, _file.data.content)
        setFile(content)
      })
      .catch((error) => {
        alert(error.response.data)
      })
  }, [filename])

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
          <div>{file}</div>
        </div>
      </div>
    </div>
  )
}

export default FileInfo