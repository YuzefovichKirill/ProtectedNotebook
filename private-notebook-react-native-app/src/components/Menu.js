import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native"

const Menu = () => {
  const navigation = useNavigation()

  return (
    <View style={styles.menuContainer}> 
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('CreateFile')}>
        <Text>CreateFile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('FileList')}>
        <Text>FileList</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('UpdateFile')}>
        <Text>UpdateFile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('FileInfo')}>
        <Text>FileInfo</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly"
  }
})

export default Menu;
