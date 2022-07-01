import { Typography, Button, Grid } from "@mui/material";

import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { useState } from "react";
import CreateTaskForm from "./CreateTaskForm";
import Modals from "../Components/Modals";
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
    <>
      <Modals open={open} onClose={handleClose} title={t("addTask")}>
        <CreateTaskForm />
      </Modals>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t("tasks")}
          </Typography>
          <Typography variant="subtitle2">{t("taskDescription")}</Typography>
        </Grid>
        {isAdmin ? (
          <Grid item>
            <Button
              sx={{ mt: { xs: 2, md: 0 } }}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
              onClick={() => setOpenPopup(true)}
            >
              {t("createTask")}
            </Button>
          </Grid>
        ) : null}
      </Grid>
    </>
  );
}

export default PageHeader;
