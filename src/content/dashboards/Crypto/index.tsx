import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import PageHeader from "./PageHeader";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import {
  Container,
  Grid,
  Card,
  Typography,
  Box,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountBalance from "./AccountBalance";
import Wallets from "./Wallets";
import AccountSecurity from "./AccountSecurity";
import WatchList from "./WatchList";
import { grey } from "@mui/material/colors";
import { taskService } from "src/services/task.service";

const greyColor = grey[600];

function DashboardCrypto() {
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    taskService
      .getAll()
      .then(({ data }) => {
        // console.log(data);
        setStatus(data.tasks);
      })
      .finally(() => setLoading(false));
  }, []);

  const newStatus = status.filter((item) => item.statusId === "new");
  const countNewStatus = newStatus.length;

  const unDoneStatus = status.filter((item) => item.statusId === "undone");
  const countUndone = unDoneStatus.length;

  const doneStatus = status.filter((item) => item.statusId === "done");
  const countDone = doneStatus.length;

  const progressStatus = status.filter(
    (item) => item.statusId === "inProgress"
  );
  const countProgress = progressStatus.length;

  // console.log(countNewStatus);
  // console.log(status);

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <PageTitleWrapper></PageTitleWrapper>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ pb: 2 }}>
          Tasks
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} lg={3}>
            <Card>
              <Box sx={{ m: 2, px: 1 }}>
                <Typography
                  variant="h4"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <AssignmentLateIcon
                    fontSize="small"
                    color="success"
                    sx={{ mr: 1 }}
                  />
                  New
                </Typography>
              </Box>
              <Box
                sx={{ mx: 2, mt: 4, px: 1 }}
                display="flex"
                justifyContent="start"
              >
                <Typography variant="h5" color={greyColor}>
                  Total
                </Typography>
              </Box>
              <Box
                sx={{ mx: 2, mb: 2, px: 1 }}
                display="flex"
                justifyContent="start"
              >
                <Typography variant="h3">
                  {loading ? <CircularProgress size={20} /> : countNewStatus}
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card>
              <Box sx={{ m: 2, px: 1 }}>
                <Typography
                  variant="h4"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <AssignmentIcon
                    fontSize="small"
                    color="error"
                    sx={{ mr: 1 }}
                  />
                  Undone
                </Typography>
              </Box>
              <Box
                sx={{ mx: 2, mt: 4, px: 1 }}
                display="flex"
                justifyContent="start"
              >
                <Typography variant="h5" color={greyColor}>
                  Total
                </Typography>
              </Box>
              <Box
                sx={{ mx: 2, mb: 2, px: 1 }}
                display="flex"
                justifyContent="start"
              >
                <Typography variant="h3">
                  {" "}
                  {loading ? <CircularProgress size={20} /> : countUndone}
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card>
              <Box sx={{ m: 2, px: 1 }}>
                <Typography
                  variant="h4"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <AssignmentTurnedInIcon
                    fontSize="small"
                    color="primary"
                    sx={{ mr: 1 }}
                  />
                  Done
                </Typography>
              </Box>
              <Box
                sx={{ mx: 2, mt: 4, px: 1 }}
                display="flex"
                justifyContent="start"
              >
                <Typography variant="h5" color={greyColor}>
                  Total
                </Typography>
              </Box>
              <Box
                sx={{ mx: 2, mb: 2, px: 1 }}
                display="flex"
                justifyContent="start"
              >
                <Typography variant="h3">
                  {" "}
                  {loading ? <CircularProgress size={20} /> : countDone}
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card>
              <Box sx={{ m: 2, px: 1 }}>
                <Typography
                  variant="h4"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <AssignmentIcon
                    fontSize="small"
                    color="warning"
                    sx={{ mr: 1 }}
                  />
                  In Progress
                </Typography>
              </Box>
              <Box
                sx={{ mx: 2, mt: 4, px: 1 }}
                display="flex"
                justifyContent="start"
              >
                <Typography variant="h5" color={greyColor}>
                  Total
                </Typography>
              </Box>
              <Box
                sx={{ mx: 2, mb: 2, px: 1 }}
                display="flex"
                justifyContent="start"
              >
                <Typography variant="h3">
                  {" "}
                  {loading ? <CircularProgress size={20} /> : countProgress}
                </Typography>
              </Box>
            </Card>
          </Grid>
          {/* <Grid item xs={12}>
            <AccountBalance />
          </Grid>
          <Grid item lg={8} xs={12}>
            <Wallets />
          </Grid>
          <Grid item lg={4} xs={12}>
            <AccountSecurity />
          </Grid> */}
          {/* <Grid item xs={12}>
            <WatchList />
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}

export default DashboardCrypto;
