import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useContext } from 'react';
import { Text } from 'react-native';
import { AuthContext } from '../contexts/auth-context';
import AuthService from '../services/AuthService'

const userSchema = Yup.object({
  email: Yup.string().email('Email is not valid').required('Email is required'),
  password: Yup.string().min(8, 'Password is too short').required('Password is required'),
});

const initialValues = { email: '', password: '' };


const Login = ({navigation}) => {
  const { setUserId } = useContext(AuthContext)
  const authService = new AuthService()

  const handleSubmit = (navigation, values) => {
    authService.login(values)
      .then((userId) => {
        setUserId(userId.data)
        navigation.navigate('FileList')
      })
      .catch((error) => alert(error.response.data))
      //navigation.navigate('FileList')
  }

  return (
    <Formik initialValues={initialValues} validationSchema={userSchema} onSubmit={handleSubmit.bind(null, navigation)}>
      <Form>
        <label htmlFor="email"><Text>Email</Text></label>
        <Field type="email" name="email" />
        <ErrorMessage name="email" />
        <br/>
        <label htmlFor="password"><Text>Password</Text></label>
        <Field type="password" name="password" />
        <ErrorMessage name="password" />
        <br/>
        <button title='Submit' type="submit"><Text>Submit</Text></button>
      </Form>
    </Formik>
  )
}

export default Login
