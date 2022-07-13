import { useState, useEffect } from "react";

import { Tooltip, IconButton, Grid, Typography, Divider } from "@mui/material";

import { useTranslation } from "react-i18next";
import { formService } from "src/services/form.service";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import AddIcon from "@mui/icons-material/Add";
import FormFieldTable from "./FormFieldTable";

function FormFieldSideBar() {
  const [forms, setForms] = useState([]);
  const [sideBarToggle, setSideBarToggle] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    formService
      .getFields()
      .then(({ data }) => {
        data.sort((a, b) => a.order - b.order);

        setForms(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleClose = () => {
    setSideBarToggle(false);
  };

  const handleOpen = () => {
    setSideBarToggle(true);
  };
  const { t } = useTranslation();

  return (
    <>
      {sideBarToggle ? (
        <>
          <Grid
            sx={{
              width: 300,
              height: "100%",
            }}
          >
            <Grid
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "white",
                px: 2,
                py: 1,
              }}
            >
              <Grid item>
                <Typography variant="h5">{t("Form Fields")}</Typography>
              </Grid>
              <Grid item>
                <Tooltip arrow title="Toggle form field">
                  <IconButton color="primary">
                    <CloseTwoToneIcon fontSize="small" onClick={handleClose} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            <Divider />
            <Grid item sx={{ height: "100%", backgroundColor: "white" }}>
              <FormFieldTable data={forms} />
            </Grid>
          </Grid>
        </>
      ) : (
        <Tooltip arrow title="Toggle form field">
          <IconButton
            color="primary"
            onClick={handleOpen}
            style={{ marginTop: 50 }}
          >
            <Typography
              variant="h5"
              style={{ display: "flex", alignItems: "center", marginRight: 5 }}
            >
              Add form field <AddIcon fontSize="small" />
            </Typography>
          </IconButton>
        </Tooltip>
      )}
    </>
  );
}

export default FormFieldSideBar;
