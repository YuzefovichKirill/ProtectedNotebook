import React, { useState, useEffect } from "react";

export const RSAContext = React.createContext()

const RSAProvider = ({children}) => {
  const [RSAKey, setRSAKey] = useState(localStorage.getItem('RSAKey'))

  useEffect(() => {
    if (RSAKey === null) {
      localStorage.removeItem('RSAKey')
    }
    else {
      localStorage.setItem('RSAKey', RSAKey)
    }
  }, [RSAKey])

  return (
    <RSAContext.Provider
      value={{
        setRSAKey
      }}>
      {children}
    </RSAContext.Provider>
  )
}

export default RSAProvider
