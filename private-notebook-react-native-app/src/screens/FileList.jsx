import { View, Text } from "react-native"
import FileService from "../services/FileService"
import { AuthContext } from "../contexts/auth-context"
import { useEffect, useContext, useState } from "react"

const FileList = ({ navigation }) => {
  var { userId } = useContext(AuthContext)
  const fileService = new FileService()
  var [filenames, setFilenames] = useState([])
  
  useEffect(() => {
    if (userId === null) return 
    fileService.getFileList(userId)
      .then(_filenames => {
        setFilenames(_filenames.data.filenames)
      })
      .catch((error) => {
        alert(error.response.data)
      })	  
  }, [userId])
  
  const handleDeleteFile = (name) => {
    fileService.deleteFile(userId, name)
      .then(() => {
        fileService.getFileList(userId)
          .then(_filenames => setFilenames(_filenames.data.filenames))
          .catch((error) => alert(error.response.data))
      })
      .catch((error) => alert(error.response.data))	
  }

  return (
    <View>
      <button onClick={()=> navigation.navigate('CreateFile')}><Text>Create File</Text></button>
      {filenames?.map((filename) => {
        return(
          <View>
            <Text>File name: {filename}</Text>
            <button onClick={(filename)=> navigation.navigate('FileInfo', { filename })}><Text>Info</Text></button>
            <button onClick={(filename)=> navigation.navigate('ChangeFile', { filename })}><Text>Change</Text></button>
            <button onClick={(filename)=> handleDeleteFile(filename)}><Text>Delete</Text></button>
            <br/>
          </View>
        )
      })}
    </View>
  )
}
export default FileList
