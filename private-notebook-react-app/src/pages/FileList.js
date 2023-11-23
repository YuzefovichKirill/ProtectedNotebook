import React, { useState, useEffect, useContext } from "react"
import FileService from "../services/FileService"
import { Link } from "react-router-dom"
import { AuthContext } from "../auth-context"

const FileList = () => {
  var { jwtToken } = useContext(AuthContext)
  const fileService = new FileService()
  var [filenames, setFilenames] = useState([]);
  
  useEffect(() => {
    if (jwtToken === null) return 
    fileService.getFileList()
      .then(_filenames => {
        setFilenames(_filenames.data.filenames)
      })
      .catch((error) => {
        alert(error.response.data)
      })	  
  }, [])     

  const handleDeleteFile = (name) => {
    fileService.deleteFile(name)
      .then(() => {
        fileService.getFileList()
          .then(_filenames => setFilenames(_filenames.data.filenames))
          .catch((error) => alert(error.response.data))
      })
      .catch((error) => alert(error.response.data))	
  }

  return(
    <div className="container">
      <p className="title">Files names</p>
      <Link to='/files/create'>Create file</Link>
      <div >
        {filenames && filenames.map(name => {
          return (
            <div  className="form-row">
              <div style={{display: 'flex', flexDirection: 'row' }} className="input-data">
                <div>File name: {name}</div>
                <Link to='/files/info' style={{marginLeft: '10px'}} state={{filename: name}}>File info</Link>
                <Link to='/files/update' style={{marginLeft: '10px'}} state={{filename: name}}>Update file</Link>
                <button style={{marginLeft: '10px'}} onClick={() => handleDeleteFile(name)}>Delete file</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FileList
