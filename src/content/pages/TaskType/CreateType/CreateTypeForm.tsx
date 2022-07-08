import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useFormik } from "formik";
import { taskService } from "src/services/task.service";
import * as yup from "yup";
import { getAxiosErrorMessage } from "src/lib";

const validationSchema = yup.object({
  key: yup
    .number()
    .required("required")
    .positive()
    .min(1, "Must be at least 1 minimum number"),
  description: yup.string().optional(),
  label: yup.string().required("required"),
});

const CreateTaskTypeForm = ({ onFinish }) => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      key: "",
      label: "",
      description: "",
    },
    onSubmit: async (values, actions) => {
      try {
        setSuccess("");
        setError("");

        await taskService.createTaskTypes({
          ...values,
          key: values.key.toString()
        });
        actions.resetForm();
        setSuccess("Added new task type");
        await onFinish();
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
    <>
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
              type="number"
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
              helperText={
                formik.touched.description && formik.errors.description
              }
              fullWidth
            />
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
    </>
  );
};

export default CreateTaskTypeForm;
