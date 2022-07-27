import { Grid, Card, Typography, Box, CircularProgress } from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { grey } from "@mui/material/colors";
import { useTranslation } from "react-i18next";

const greyColor = grey[600];

type Props = {
  countNewStatus: any;
  countUndone: any;
  countDone: any;
  countProgress: any;
  loading: boolean;
};

function TaskGrid({
  countNewStatus,
  countUndone,
  countDone,
  countProgress,
  loading,
}: Props) {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} lg={6}>
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
              {t("new")}
            </Typography>
          </Box>
          <Box
            sx={{ mx: 2, mt: 4, px: 1 }}
            display="flex"
            justifyContent="start"
          >
            <Typography variant="h5" color={greyColor}>
              {t("Total")}
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
      <Grid item xs={12} md={6} lg={6}>
        <Card>
          <Box sx={{ m: 2, px: 1 }}>
            <Typography
              variant="h4"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <AssignmentIcon fontSize="small" color="error" sx={{ mr: 1 }} />
              {t("unDone")}
            </Typography>
          </Box>
          <Box
            sx={{ mx: 2, mt: 4, px: 1 }}
            display="flex"
            justifyContent="start"
          >
            <Typography variant="h5" color={greyColor}>
              {t("Total")}
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
      <Grid item xs={12} md={6} lg={6}>
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
              {t("done")}
            </Typography>
          </Box>
          <Box
            sx={{ mx: 2, mt: 4, px: 1 }}
            display="flex"
            justifyContent="start"
          >
            <Typography variant="h5" color={greyColor}>
              {t("Total")}
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
      <Grid item xs={12} md={6} lg={6}>
        <Card>
          <Box sx={{ m: 2, px: 1 }}>
            <Typography
              variant="h4"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <AssignmentIcon fontSize="small" color="warning" sx={{ mr: 1 }} />
              {t("inProgress")}
            </Typography>
          </Box>
          <Box
            sx={{ mx: 2, mt: 4, px: 1 }}
            display="flex"
            justifyContent="start"
          >
            <Typography variant="h5" color={greyColor}>
              {t("Total")}
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
    </Grid>
  );
}

export default TaskGrid;
