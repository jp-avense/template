import { createContext, useState, useEffect } from "react";
import { apiService } from "src/services/api.service";

type AuthContextT = {
  handleAccess: {
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

  const handleAccess = { accessToken, setAccessToken };
  const handleId = { idToken, setIdToken };
  const handleRefresh = { refreshToken, setRefreshToken };

  useEffect(() => {
    if (accessToken)
      apiService.defaults.headers.common["x-access-token"] = accessToken;
    else delete apiService.defaults.headers.common["x-access-token"];
  }, [accessToken]);

  useEffect(() => {
    if (idToken)
      apiService.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;
    else delete apiService.defaults.headers.common["Authorization"];
  }, [idToken]);

  useEffect(() => {
    if (refreshToken)
      apiService.defaults.headers.common["x-refresh-token"] = refreshToken;
    else delete apiService.defaults.headers.common["x-refresh-token"];
  }, [refreshToken]);

  return (
    <AuthContext.Provider value={{ handleAccess, handleId, handleRefresh }}>
      {children}
    </AuthContext.Provider>
  );
};
