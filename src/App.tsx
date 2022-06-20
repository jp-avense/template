import { useRoutes } from "react-router-dom";
import router from "src/router";
import { useEffect, useState } from "react";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import { Box, CircularProgress, CssBaseline, setRef } from "@mui/material";
import ThemeProvider from "./theme/ThemeProvider";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { apiService } from "./services/api.service";
import { authService } from "./services/auth.service";
import { useCookies } from "react-cookie";

function App() {
  const content = useRoutes(router);
  const context = useContext(AuthContext);
  const [cookies, setCookie] = useCookies(["refreshToken"]);

  const {
    handleAccess: { accessToken, setAccessToken },
    handleId: { idToken, setIdToken },
    handleRefresh: { refreshToken, setRefreshToken },
    handleLoading: { setLoading, loading },
    handleUser: { getUser },
  } = context;

  useEffect(() => {
    const token = cookies.refreshToken;

    if (token) {
      setRefreshToken(token);
    }
  }, [cookies.refreshToken]);

  useEffect(() => {
    if (refreshToken) {
      setLoading(true);
      authService
        .refresh(refreshToken)
        .then(({ data }) => {
          const { AccessToken, IdToken } = data.AuthenticationResult;

          setAccessToken(AccessToken);
          setIdToken(IdToken);

          return getUser(IdToken);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [refreshToken]);

  useEffect(() => {
    if (accessToken && idToken) {
      setLoading(false);
    }
  }, [accessToken, idToken]);

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
