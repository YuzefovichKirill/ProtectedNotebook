import React, { useState, useEffect, useContext, useRef } from "react"
import FileService from "../services/FileService"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../auth-context"

const CreateFile = () => {
  const navigate = useNavigate()
  const fileService = new FileService()
  const filename = useRef(null)
  const content = useRef(null)
  var file = {
    filename: '',
    content: ''
  }
    
  const handleCreateFile = (event) => {
    event.preventDefault()
    file.filename = filename.current.value
    file.content = content.current.value

    fileService.createFile(file)
      .then(() => {
        navigate('/files/list', { replace: true})
      })
      .catch((error) => alert(error.response.data))	
  }

  return(
    <div className="container">
      <p className="title">Create file</p>
      <form onSubmit={handleCreateFile}>
        <div className="form-row">
          <div className="input-data">
            <label>File name</label>
            <input ref={filename} type="text" required/>
          </div>
        </div>
        <div className="form-row">
          <div className="input-data">
            <label>Content</label>
            <input ref={content} type="text" required/>
          </div>
        </div>
        <div className="submit-button">
          <input type="submit" value="Create"/>
        </div>
      </form>
    </div>
  )
}

export default CreateFile