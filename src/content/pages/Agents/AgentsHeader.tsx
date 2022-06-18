import { Typography, Button, Grid } from "@mui/material";

import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import Modals from "../Components/Modals";
import AgentsForm from "./AgentsForm";
import { useState } from "react";

function PageHeader() {
  const [open, setOpenPopup] = useState(false);
  const handleClose = () => {
    setOpenPopup(false);
  };
  const user = {
    name: "Catherine Pike",
    avatar: "/static/images/avatars/1.jpg",
  };
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Agents
        </Typography>
        <Typography variant="subtitle2">Users who uses the system</Typography>
      </Grid>
      <Grid item>
        <Modals open={open} onClose={handleClose} title="Add Agent">
          <AgentsForm />
        </Modals>

        <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
          onClick={() => setOpenPopup(true)}
        >
          Add Agent
        </Button>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
