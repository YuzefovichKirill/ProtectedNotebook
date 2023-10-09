import React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RSAProvider from "./src/contexts/rsa-context";
import AuthProvider from "./src/contexts/auth-context";

import Menu from "./src/components/Menu";
import Login from "./src/screens/Login"
import Register from "./src/screens/Register"
import FileList from "./src/screens/FileList"
import FileInfo from "./src/screens/FileInfo"
import CreateFile from "./src/screens/CreateFile"
import UpdateFile from "./src/screens/UpdateFile"

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <RSAProvider>
      <AuthProvider>
        <NavigationContainer>
          <Text></Text>
          <Text></Text>
          <Menu/>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="CreateFile" component={CreateFile} />
            <Stack.Screen name="FileList" component={FileList} />
            <Stack.Screen name="UpdateFile" component={UpdateFile} />
            <Stack.Screen name="FileInfo" component={FileInfo} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </RSAProvider>
  )
}
    /*<View style={{marginTop:'20px'}}>
      <View>
        <Text></Text>
        <Menu/>
        <Text>hi</Text>
      </View> 
    </View>*/