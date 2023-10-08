import React, { useState, useEffect } from "react";

export const RSAContext = React.createContext()

const RSAProvider = ({children}) => {
  const [RSAKey, setRSAKey] = useState(localStorage.getItem('RSAKey'))
  const [RSAModule, setRSAModule] = useState(localStorage.getItem('RSAModule'))

  useEffect(() => {
    if (RSAKey === null) {
      localStorage.removeItem('RSAKey')
    }
    else {
      localStorage.setItem('RSAKey', RSAKey)
    }
  }, [RSAKey])

  useEffect(() => {
    if (RSAModule === null) {
      localStorage.removeItem('RSAModule')
    }
    else {
      localStorage.setItem('RSAModule', RSAModule)
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
