import { useContext } from "react"
import { View, Text } from "react-native"
import FileService from "../services/FileService"
import { AuthContext } from "../contexts/auth-context"
import { RSAContext } from "../contexts/rsa-context"
import { RSADecrypt } from "../crypto/RSA" 

const FileInfo = ({ route, navigation }) => {
  var { filename } = route.params
  var { userId } = useContext(AuthContext)
  const { RSAKey, RSAModule } = useContext(RSAContext)
  const fileService = new FileService()
  var [file, setFile] = useState()

  useEffect(() => {
    if (userId === null || filename === undefined) return 
    const body = {
      filename
    }
    fileService.getFile(userId, body)
      .then(_file => {
        const sessionKey = RSADecrypt(_file.data.sessionKey, RSAKey, RSAModule)
        //const content = SerpentDecrypt(sessionKey, _file.data.content)
        //setFile(content)
      })
      .catch((error) => {
        alert(JSON.stringify(error))
      })
  }, [userId, filename])

  return (
    <View>
      <Text>Filename:</Text>
      <Text>{filename}</Text>
      <Text>Content:</Text>
      <Text>{file}</Text>
    </View>
  )
}
export default FileInfo
