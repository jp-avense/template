import { useNavigate, useRoutes } from "react-router-dom";
import router from "src/router";
import { useEffect } from "react";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import { Box, CircularProgress, CssBaseline } from "@mui/material";
import ThemeProvider from "./theme/ThemeProvider";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { apiService } from "./services/api.service";
import { authService } from "./services/auth.service";
import { useCookies } from "react-cookie";
import "./i18n/i18n.ts";
import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();
  const content = useRoutes(router);
  const context = useContext(AuthContext);
  const [cookies, setCookie, removeCookie] = useCookies(["refreshToken"]);
  const navigate = useNavigate();

  const {
    handleAccess: { accessToken, setAccessToken },
    handleId: { idToken, setIdToken },
    handleRefresh: { refreshToken, setRefreshToken },
    handleLoading: { setLoading, loading },
    handleUser: { getUser, user },
  } = context;

  useEffect(() => {
    const tokenFromCookie = cookies.refreshToken;

    if (tokenFromCookie && !refreshToken) {
      setRefreshToken(tokenFromCookie);
      authService
        .refresh(tokenFromCookie)
        .then(({ data }) => {
          const { AccessToken, IdToken } = data.AuthenticationResult;
          setAccessToken(AccessToken);
          setIdToken(IdToken);

          return getUser(IdToken);
        })
        .catch(() => {
          removeCookie("refreshToken");
          navigate("/login");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [cookies.refreshToken]);

  useEffect(() => {
    const requestIntercept = apiService.interceptors.request.use((request) => {
      return request;
    });

    const responseIntercept = apiService.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (
          error?.response?.status === 401 &&
          !prevRequest?.sent &&
          cookies.refreshToken
        ) {
          await authService.refresh(cookies.refreshToken).then(({ data }) => {
            const { AccessToken, IdToken } = data.AuthenticationResult;
            setAccessToken(AccessToken);
            setIdToken(IdToken);
            prevRequest.sent = true;
            prevRequest.headers["Authorization"] = `Bearer ${IdToken}`;
            prevRequest.headers["x-access-token"] = AccessToken;
            return apiService(prevRequest);
          });
        }
        return Promise.reject(error);
      }
    );
    return () => {
      apiService.interceptors.request.eject(requestIntercept);
      apiService.interceptors.request.eject(responseIntercept);
    };
  }, []);

  useEffect(() => {
    if (accessToken && idToken && user) {
      setLoading(false);
    }
  }, [accessToken, idToken, user]);

  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        {!loading ? (
          content
        ) : (
          <Box mt={8} display="flex" justifyContent="center">
            <CircularProgress size={40} />
          </Box>
        )}
      </LocalizationProvider>
    </ThemeProvider>
  );
}
export default App;
