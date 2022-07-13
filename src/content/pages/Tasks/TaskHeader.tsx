import { Typography, Grid } from "@mui/material";

import { useTranslation } from "react-i18next";

function PageHeader() {
  const { t } = useTranslation();

  return (
    <>
      <Grid container justifyContent="start" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t("tasks")}
          </Typography>
          <Typography variant="subtitle2">{t("taskDescription")}</Typography>
        </Grid>
      </Grid>
    </>
  );
}

export default PageHeader;
