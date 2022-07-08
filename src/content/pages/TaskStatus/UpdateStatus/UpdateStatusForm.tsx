import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import { useFormik, yupToFormErrors } from "formik";
import { useState } from "react";
import { getAxiosErrorMessage } from "src/lib";
import { taskService } from "src/services/task.service";
import * as yup from "yup";

interface ITaskStatus {
  _id: string;
  Key: string;
  label: string;
  description?: string;
}

type Props = {
  selectedStatus: ITaskStatus;
  onDone: () => Promise<any>;
};

const validationSchema = yup.object({
  label: yup.string().required("required"),
  description: yup.string().optional(),
});

const UpdateStatusForm = ({ selectedStatus, onDone }: Props) => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      label: selectedStatus.label,
      description: selectedStatus.description,
    },
    validationSchema,
    onSubmit: async (values, actions) => {
      try {
        setError("");
        setSuccess("");

        await taskService.updateStatus(selectedStatus._id, values);
        setSuccess("Updated status");
        
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
      <Grid container spacing={3} direction="column">
        <Grid item>
          {error ? <Alert severity="error">{error}</Alert> : null}
          {success ? <Alert severity="success">{success}</Alert> : null}
        </Grid>
        <Grid item>
          <TextField
            name="key"
            label="Key"
            defaultValue={selectedStatus.Key}
            disabled
            fullWidth
            helperText="You cannot change this field"
          />
        </Grid>
        <Grid item>
          <TextField
            name="label"
            label="Label"
            value={formik.values.label}
            error={formik.touched.label && Boolean(formik.errors.label)}
            helperText={formik.touched.label && formik.errors.label}
            fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid item>
          <TextField
            name="description"
            label="Description"
            value={formik.values.description}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid item>
          <Button
            type="submit"
            disabled={formik.isSubmitting}
            fullWidth
            variant="contained"
          >
            {formik.isSubmitting ? <CircularProgress size={18} /> : "Submit"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default UpdateStatusForm;
