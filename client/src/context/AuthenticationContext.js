const { createContext, useState } = require("react");

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  return (
    <AuthenticationContext.Provider value={{ setUser, user }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
