import { Typography, Button, Grid } from "@mui/material";

import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { useState } from "react";
import CreateTaskForm from "./CreateTaskForm";
import Modals from "../Components/Modals";

function PageHeader() {
  const [open, setOpenPopup] = useState(false);
  const handleClose = () => {
    setOpenPopup(false);
  };

  return (
    <>
      <Modals open={open} onClose={handleClose} title="Add task">
        <CreateTaskForm />
      </Modals>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            Tasks
          </Typography>
          <Typography variant="subtitle2">
            These are the tasks for the project
          </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
            onClick={() => setOpenPopup(true)}
          >
            Create task
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default PageHeader;
