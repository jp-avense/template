import { createContext, useState } from "react";

type AuthContextT = {
  handleAuth: {
    accessToken: any;
    setAccessToken: React.Dispatch<any>;
  };
  handleId: {
    idToken: any;
    setIdToken: React.Dispatch<any>;
  };
  handleRefresh: {
    refreshToken: any;
    setRefreshToken: React.Dispatch<any>;
  };
};
export const AuthContext = createContext<AuthContextT>({} as AuthContextT);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const handleAuth = { accessToken, setAccessToken };
  const handleId = { idToken, setIdToken };
  const handleRefresh = { refreshToken, setRefreshToken };

  return (
    <AuthContext.Provider value={{ handleAuth, handleId, handleRefresh }}>
      {children}
    </AuthContext.Provider>
  );
};
