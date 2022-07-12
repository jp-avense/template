import { Typography, Button, Grid } from "@mui/material";

import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import Modals from "../Components/Modals";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useRoles from "src/hooks/useRole";

function PageHeader() {
  const { t } = useTranslation();
  const [open, setOpenPopup] = useState(false);
  const roles = useRoles();

  const isAdmin = roles.includes("admin");
  const handleClose = () => {
    setOpenPopup(false);
  };

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {t("Field Forms")}
        </Typography>
        <Typography variant="subtitle2">
          {t("fields to be used on form builder")}
        </Typography>
      </Grid>
      {isAdmin ? (
        <Grid item>
          <Modals open={open} onClose={handleClose} title={t("createField")}>
            <span>create field here</span>
          </Modals>

          <Button
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
            onClick={() => setOpenPopup(true)}
          >
            {t("add field")}
          </Button>
        </Grid>
      ) : null}
    </Grid>
  );
}

export default PageHeader;
