import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const RSAContext = React.createContext()

const RSAProvider = ({children}) => {
  const [RSAKey, setRSAKey] = useState(null)//useState(AsyncStorage.getItem('RSAKey'))
  AsyncStorage.getItem('RSAKey')
    .then((key => setRSAKey(key)))
  const [RSAModule, setRSAModule] = useState(null)//useState(AsyncStorage.getItem('RSAModule'))
  AsyncStorage.getItem('RSAModule')
    .then((module => setRSAKey(module)))

  useEffect(async () => {
    if (RSAKey === null) {
      await AsyncStorage.removeItem('RSAKey')
    }
    else {
      await AsyncStorage.setItem('RSAKey', RSAKey)
    }
  }, [RSAKey])

  useEffect(async () => {
    if (RSAModule === null) {
      await AsyncStorage.removeItem('RSAModule')
    }
    else {
      await AsyncStorage.setItem('RSAModule', RSAModule)
    }
  }, [RSAModule])

  return (
    <RSAContext.Provider
      value={{
        RSAKey,
        RSAModule,
        setRSAKey,
        setRSAModule
      }}>
      {children}
    </RSAContext.Provider>
  )
}

export default RSAProvider
