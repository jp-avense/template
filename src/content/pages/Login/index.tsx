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
  Paper,
  Avatar,
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
import { useTranslation } from "react-i18next";
import hebFlag from "../../../assets/images/icons/hebFlag.svg";
import enFlag from "../../../assets/images/icons/enFlag.svg";

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const validationSchema = yup.object({
    username: yup
      .string()
      .required(t("userNameRequiredText"))
      .email(t("emailUserValidText")),
    password: yup.string().required(t("passwordRequiredText")),
  });

  const [error, setError] = useState("");
  const context = useContext(AuthContext);
  const [cookies, setCookie, removeCookie] = useCookies(["refreshToken"]);

  const {
    handleAccess: { accessToken, setAccessToken },
    handleRefresh: { setRefreshToken },
    handleId: { idToken, setIdToken },
    handleUser: { setUser, getUser },
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

        await getUser(IdToken);

        navigate("/dashboard");
      } catch (error) {
        if (error.response.data) setError(t(error.response.data.message));
        else if (error.request) setError(t("noResponse"));
        else setError(t("unableToSubmit"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (accessToken && idToken) {
    return <Navigate to="/dashboard" />;
  }

  const handleDirection = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <>
      <Helmet>{t("login")}</Helmet>
      <Paper>
        <Grid container justifyContent="end" alignItems="center" mb={2}>
          <Grid item py={0.5} px={2} spacing={2}>
            <Button
              onClick={() => handleDirection("en")}
              startIcon={
                <Avatar
                  sx={{ width: 24, height: 24 }}
                  variant="square"
                  src={enFlag}
                />
              }
            >
              {t("english")}
            </Button>
            <Button
              onClick={() => handleDirection("he")}
              startIcon={
                <Avatar
                  sx={{ width: 24, height: 24 }}
                  variant="square"
                  src={hebFlag}
                />
              }
            >
              {t("hebrew")}
            </Button>
          </Grid>
        </Grid>
      </Paper>
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
