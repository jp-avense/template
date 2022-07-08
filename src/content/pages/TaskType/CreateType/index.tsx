import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Typography, Button, Grid } from "@mui/material";
import useRoles from "src/hooks/useRole";
import Modals from "../../Components/Modals";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";

function CreateTaskType({ children }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const roles = useRoles();
  const isAdmin = roles.includes("admin");

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Modals open={open} onClose={handleClose} title="Add task type">
        {children}
      </Modals>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t("Task Types")}
          </Typography>
        </Grid>
        {isAdmin ? (
          <Grid item>
            <Button
              sx={{ mt: { xs: 2, md: 0 } }}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
              onClick={() => setOpen(true)}
            >
              {t("Create task type")}
            </Button>
          </Grid>
        ) : null}
      </Grid>
    </>
  );
}

export default CreateTaskType;
