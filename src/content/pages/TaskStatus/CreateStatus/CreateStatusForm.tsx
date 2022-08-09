import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { taskService } from "src/services/task.service";
import * as yup from "yup";
import { getAxiosErrorMessage } from "src/lib";

const validationSchema = yup.object({
  description: yup.string().optional(),
  label: yup.string().required("required"),
  systemStatusKey: yup.string().required(),
});

const CreateStatusForm = ({ onDone }) => {
  const { t } = useTranslation();

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      label: "",
      description: "",
      systemStatusKey: "none",
    },
    onSubmit: async (values, actions) => {
      try {
        setError("");
        setSuccess("");

        await taskService.createTaskStatus(values);
        actions.resetForm();
        setSuccess("Added new status");
        await onDone();
      } catch (error) {
        setError(getAxiosErrorMessage(error));
      }
    },
  });

  const handleChange = (e) => {
    setSuccess("");
    setError("");
    formik.handleChange(e);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} direction="column">
        <Grid item>
          {error ? <Alert severity="error">{error}</Alert> : null}
          {success ? <Alert severity="success">{success}</Alert> : null}
        </Grid>
        <Grid item>
          <TextField
            label={t("label")}
            name="label"
            onChange={(e) => handleChange(e)}
            error={formik.touched.label && Boolean(formik.errors.label)}
            value={formik.values.label}
            helperText={formik.touched.label && formik.errors.label}
            fullWidth
          />
        </Grid>
        <Grid item>
          <TextField
            label={t("description")}
            name="description"
            onChange={(e) => handleChange(e)}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            value={formik.values.description}
            helperText={formik.touched.description && formik.errors.description}
            fullWidth
            multiline
          />
        </Grid>
        <Grid item>
          <FormControl fullWidth>
            <InputLabel id="select">{t("systemStatusKey")}</InputLabel>
            <Select
              label={t("systemStatusKey")}
              name="systemStatusKey"
              value={formik.values.systemStatusKey}
              fullWidth
              labelId="select"
              onChange={(e) => handleChange(e)}
              error={
                formik.touched.systemStatusKey &&
                Boolean(formik.errors.systemStatusKey)
              }
            >
              <MenuItem value="none">{t("none")}</MenuItem>
              <MenuItem value="assigned">{t("assigned")}</MenuItem>
              <MenuItem value="done">{t("done")}</MenuItem>
              <MenuItem value="inProgress">{t("inProgress")}</MenuItem>
              <MenuItem value="new">{t("new")}</MenuItem>
            </Select>
            <FormHelperText>
              {formik.touched.systemStatusKey &&
              Boolean(formik.errors.systemStatusKey)
                ? formik.touched.systemStatusKey &&
                  formik.errors.systemStatusKey
                : t("chooseSystemStatus")}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            disabled={formik.isSubmitting}
            sx={{ display: "block" }}
            type="submit"
            fullWidth
          >
            {formik.isSubmitting ? <CircularProgress size={18} /> : t("submit")}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateStatusForm;
