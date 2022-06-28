import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import { useState, useRef, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, useNavigate } from "react-router";
import logo from "src/assets/images/logo.png";
import { authService } from "src/services/auth.service";
import { useFormik } from "formik";
import { AuthContext } from "src/contexts/AuthContext";
import { useCookies } from "react-cookie";
import * as yup from "yup";
import { apiService } from "src/services/api.service";
import { useTranslation } from "react-i18next";

const validationSchema = yup.object({
  username: yup.string().required().email(),
  password: yup.string().required(),
});

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const context = useContext(AuthContext);
  const [cookies, setCookie, removeCookie] = useCookies(["refreshToken"]);

  const {
    handleAccess: { accessToken, setAccessToken },
    handleRefresh: { setRefreshToken },
    handleId: { idToken, setIdToken },
    handleUser: { setUser },
  } = context;

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema,
    onSubmit: async ({ username, password }, { setSubmitting }) => {
      try {
        setSubmitting(true);

        const { data } = await authService.login(username, password);

        const { AccessToken, RefreshToken, IdToken } =
          data.AuthenticationResult;

        setAccessToken(AccessToken);
        setRefreshToken(RefreshToken);
        setIdToken(IdToken);

        const DAYS = 60 * 60 * 24;

        setCookie("refreshToken", RefreshToken, {
          maxAge: DAYS * 30,
        });

        const user = await authService.getUser(IdToken);

        apiService.defaults.headers.common["x-tenant-name"] = `${data.tenant}`;

        setUser(user);
        navigate("/dashboard");
      } catch (error) {
        if (error.response.data) setError(error.response.data.message);
        else if (error.request) setError("No response from server");
        else setError("Unable to submit data. Please try again later");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (accessToken && idToken) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <>
      <Helmet>{t("login")}</Helmet>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        pt={4}
      >
        <Grid item>
          <img src={logo} alt="Milgam Logo" />
        </Grid>
        <Grid item>
          <Card sx={{ width: 500 }}>
            <CardHeader title={t("loginText")}></CardHeader>
            <CardContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={formik.handleSubmit}>
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={2}
                  component="div"
                >
                  <TextField
                    id="outlined-basic"
                    label={t("email")}
                    variant="outlined"
                    type="email"
                    name="username"
                    helperText={
                      formik.touched.username && formik.errors.username
                    }
                    error={formik.touched.username && !!formik.errors.username}
                    onChange={formik.handleChange}
                  />
                  <TextField
                    id="outlined-basic"
                    label={t("password")}
                    variant="outlined"
                    type="password"
                    name="password"
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    error={formik.touched.password && !!formik.errors.password}
                    onChange={formik.handleChange}
                  />
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={formik.isSubmitting}
                  >
                    {formik.isSubmitting ? (
                      <CircularProgress size={24} />
                    ) : (
                      t("login")
                    )}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default LoginPage;
