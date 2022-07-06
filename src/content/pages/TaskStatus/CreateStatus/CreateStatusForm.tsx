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
  key: yup
    .string()
    .required("required")
    .matches(/^[a-zA-Z]+$/, "Must only contain lowercase and uppercase letters")
    .min(3, "Must be at least 3 characters long"),
  description: yup.string().optional(),
  label: yup.string().required("required"),
  systemStatus: yup.string().required(),
});

const CreateStatusForm = ({ onDone }) => {
  const { t } = useTranslation();

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      key: "",
      label: "",
      description: "",
      systemStatus: "none",
    },
    onSubmit: async (values, actions) => {
      try {
        setError("");
        setSuccess("");

        await taskService.createTaskStatus(values);
        actions.resetForm();
        setSuccess("Added new status");
        await onDone()
        
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
            label="Key"
            name="key"
            onChange={(e) => handleChange(e)}
            error={formik.touched.key && Boolean(formik.errors.key)}
            value={formik.values.key}
            helperText={formik.touched.key && formik.errors.key}
            fullWidth
          />
        </Grid>
        <Grid item>
          <TextField
            label="Label"
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
            label="Description"
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
            <InputLabel id="select">System Status</InputLabel>
            <Select
              label="System status"
              name="systemStatus"
              value={formik.values.systemStatus}
              fullWidth
              labelId="select"
              onChange={(e) => handleChange(e)}
              error={
                formik.touched.systemStatus &&
                Boolean(formik.errors.systemStatus)
              }
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="assigned">Assigned</MenuItem>
              <MenuItem value="inProgress">In Progres</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
            <FormHelperText>
              {formik.touched.systemStatus &&
              Boolean(formik.errors.systemStatus)
                ? formik.touched.systemStatus && formik.errors.systemStatus
                : "Choose a system status that is related to this new status"}
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
            {formik.isSubmitting ? <CircularProgress size={18} /> : "Submit"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateStatusForm;
