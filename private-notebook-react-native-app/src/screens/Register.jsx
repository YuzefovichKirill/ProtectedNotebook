import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useContext } from 'react';
import { Text } from 'react-native';
import { AuthContext } from '../contexts/auth-context';
import AuthService from '../services/AuthService'

const userSchema = Yup.object({
  email: Yup.string().email('Email is not valid').required('Email is required'),
  password: Yup.string().min(8, 'Password is too short').required('Password is required'),
  confirmPassword: Yup.string().min(8, 'Password is too short').required('Password is required'),
});

const initialValues = { email: '', password: '', confirmPassword: '' };

const Register = ({navigation}) => {
  const {setUserId} = useContext(AuthContext)
  const authService = new AuthService()

  const handleSubmit = (navigation, values) => {
    if (values.password !== values.confirmPassword){
      alert("password doesn't match confirm password")
      return
    }
    var body = {
      email: values.email,
      password: values.password
    }
    authService.register(body)
      .then((userId) => {
        setUserId(userId.data)
        navigation.navigate('FileList')
      })
      .catch((error) => alert(error.response.data))
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
        <label htmlFor="confirmPassword"><Text>Confirm password</Text></label>
        <Field type="password" name="confirmPassword" />
        <ErrorMessage name="confirmPassword" />
        <br/>
        <button title='Submit' type="submit"><Text>Submit</Text></button>
      </Form>
    </Formik>
  )
}

export default Register
