import { Typography, Button, Grid } from "@mui/material";

import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import Modals from "../Components/Modals";
import AgentsForm from "./AgentsForm";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function PageHeader() {
  const { t } = useTranslation();
  const [open, setOpenPopup] = useState(false);
  const handleClose = () => {
    setOpenPopup(false);
  };

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {t("agents")}
        </Typography>
        <Typography variant="subtitle2">{t("agentDescription")}</Typography>
      </Grid>
      <Grid item>
        <Modals open={open} onClose={handleClose} title={t("addAgent")}>
          <AgentsForm />
        </Modals>

        <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
          onClick={() => setOpenPopup(true)}
        >
          {t("addAgent")}
        </Button>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
