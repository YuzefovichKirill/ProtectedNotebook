import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useContext } from "react"
import { Text } from "react-native"
import FileService from "../services/FileService"
import { AuthContext } from "../contexts/auth-context"

const userSchema = Yup.object({
  filename: Yup.string().required('filename is required'),
  content: Yup.string().required('content is required')
});

const CreateFile = ({ navigation }) => {
  var { userId } = useContext(AuthContext)
  const fileService = new FileService()
  var file = {
    filename: '',
    content: ''
  }
  
  const handleSubmit = (navigation, values) => {
    console.log(values)
    fileService.createFile(userId, values)
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

export default CreateFile
