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
import { useNavigate } from "react-router";
import logo from "src/assets/images/logo.png";
import { AuthService } from "src/services/auth.service";
import { useFormik } from "formik";
import { AuthContext } from "src/contexts/AuthContext";
import { useCookies } from "react-cookie";

const service = new AuthService();

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const context = useContext(AuthContext);
  const [cookies, setCookie] = useCookies(["refreshToken"]);

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    onSubmit: async ({ username, password }, { setSubmitting }) => {
      try {
        setSubmitting(true);

        const { data } = await service.login(username, password);

        const { AccessToken, RefreshToken, IdToken } =
          data.AuthenticationResult;

        console.log(AccessToken, RefreshToken, IdToken);

        const {
          handleAuth: { setAccessToken },
          handleRefresh: { setRefreshToken },
          handleId: { setIdToken },
        } = context;

        setAccessToken(AccessToken);
        setRefreshToken(RefreshToken);
        setIdToken(IdToken);

        const DAYS = 60 * 60 * 24;

        setCookie("refreshToken", RefreshToken, {
          maxAge: DAYS * 30,
        });
      } catch (error) {
        if (error.response) setError(error.response.data.message);
        else if (error.request) setError("No response from server");
        else setError("Unable to submit data. Please try again later");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Helmet>Login</Helmet>
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
            <CardHeader title="Login to the app"></CardHeader>
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
                    label="Email"
                    variant="outlined"
                    type="email"
                    name="username"
                    onChange={formik.handleChange}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Password"
                    variant="outlined"
                    type="password"
                    name="password"
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
                      "Login"
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
