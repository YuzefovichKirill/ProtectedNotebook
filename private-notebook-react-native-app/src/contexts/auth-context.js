import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = React.createContext()

const AuthProvider = ({children}) => {
  const [userId, setUserId] = useState(null)//useState(AsyncStorage.getItem('userId'))

  useEffect(async () => {
    if (userId === null) {
      await AsyncStorage.removeItem('userId')
    }
    else {
      await AsyncStorage.setItem('userId', userId)
    }
  }, [userId])

  return (
    <AuthContext.Provider
      value={{
        userId,
        setUserId
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
