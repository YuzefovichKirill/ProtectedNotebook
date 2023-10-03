import React, { useState, useEffect } from "react";

export const AuthContext = React.createContext()

const AuthProvider = ({children}) => {
  const [userId, setUserId] = useState(localStorage.getItem('userId'))

  useEffect(() => {
    if (userId === null) {
      localStorage.removeItem('userId')
    }
    else {
      localStorage.setItem('userId', userId)
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
