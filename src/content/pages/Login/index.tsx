import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router";
import logo from "src/assets/images/logo.png";

const LoginPage = () => {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/tasks");
  };
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
              <form action="">
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
                    type="text"
                  />
                  <TextField
                    id="outlined-basic"
                    label="Password"
                    variant="outlined"
                    type="password"
                  />
                  <Button variant="contained" onClick={navigateToHome}>
                    Login
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
