import React, { useState, useEffect } from "react";

export const AuthContext = React.createContext()

const AuthProvider = ({children}) => {
  const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwtToken'))

  useEffect(() => {
    if (jwtToken === null) {
      localStorage.removeItem('jwtToken')
    }
    else {
      localStorage.setItem('jwtToken', jwtToken)
    }
  }, [jwtToken])

  return (
    <AuthContext.Provider
      value={{
        jwtToken,
        setJwtToken
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
