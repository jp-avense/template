import { Typography, Button, Grid } from "@mui/material";

import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import Modals from "../Components/Modals";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import useRoles from "src/hooks/useRole";

function PageHeader({ children }) {
  const { t } = useTranslation();
  const roles = useRoles();

  const isAdmin = roles.includes("admin");

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {t("formBuilder")}
        </Typography>
      </Grid>
      {isAdmin ? (
        <Grid item>
          <Button
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
            component={Link}
            to="/create-form"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            {t("createForm")}
          </Button>
        </Grid>
      ) : null}
    </Grid>
  );
}

export default PageHeader;
