import { Typography, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

function PageHeader() {
  const { t } = useTranslation();

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {t("Profile")}
        </Typography>
        <Typography variant="subtitle2">
          {t("Personal settings of the user")}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
