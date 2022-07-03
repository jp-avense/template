import { createContext, useState, useEffect } from "react";
import { apiService } from "src/services/api.service";
import { authService } from "src/services/auth.service";

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
  handleLoading: {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  };
  handleUser: {
    user: any;
    setUser: React.Dispatch<any>;
    getUser: (idToken: string) => Promise<void>;
  };
};
export const AuthContext = createContext<AuthContextT>({} as AuthContextT);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = async (IdToken?: string) => {
    const { data } = await authService.getUser(IdToken);
    apiService.defaults.headers.common["x-tenant-name"] = `${data.tenant}`;
    setUser(data);
  };

  const handleAccess = { accessToken, setAccessToken };
  const handleId = { idToken, setIdToken };
  const handleRefresh = { refreshToken, setRefreshToken };
  const handleLoading = { loading, setLoading };
  const handleUser = { user, setUser, getUser };

  useEffect(() => {
    if (accessToken)
      apiService.defaults.headers.common["x-access-token"] = accessToken;
    else delete apiService.defaults.headers.common["x-access-token"];
  }, [accessToken]);

  useEffect(() => {
    if (idToken) {
      apiService.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;
    } else delete apiService.defaults.headers.common["Authorization"];
  }, [idToken]);

  useEffect(() => {
    if (refreshToken)
      apiService.defaults.headers.common["x-refresh-token"] = refreshToken;
    else delete apiService.defaults.headers.common["x-refresh-token"];
  }, [refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        handleAccess,
        handleId,
        handleRefresh,
        handleLoading,
        handleUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
