import { View, Text } from "react-native"
import React, { useState, useEffect, useContext, useRef } from "react"
import FileService from "../services/FileService"
import { AuthContext } from "../contexts/auth-context"

const UpdateFile = ({ route, navigation }) => {
  var filename = route.params
  var { userId } = useContext(AuthContext)
  const fileService = new FileService()
  var [file, setFile] = useState()

  useEffect(() => {
    if (userId === null || filename === undefined) return 
    const body = {
      filename
    }
    fileService.getFile(userId, body)
      .then((_file) => {
        setFile(_file.data)
      })
      .catch((error) => alert(error.response.data))	
  }, [userId, filename]) 
  
  const handleSubmit = (navigation, values) => {
    const body = {
      filename,
      content: values.content
    }

    fileService.patchFile(userId, body)
      .then(() => {
        navigation.navigate('FileList')
      })
      .catch((error) => alert(error.response.data))	
  }

  return (
    <Formik initialValues={file} validationSchema={userSchema} onSubmit={handleSubmit.bind(null, navigation)}>
      <Form>
        <label htmlFor="filename"><Text>File name</Text></label>
        <Field type="text" name="filename" />
        <br/>
        <label htmlFor="password"><Text>Content</Text></label>
        <Field type="text" name="password" />
        <br/>
        <button type="submit"><Text>Submit</Text></button>
      </Form>
    </Formik>
  )
}
export default UpdateFile
