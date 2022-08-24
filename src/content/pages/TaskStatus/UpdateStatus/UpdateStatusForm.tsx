import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { useFormik, yupToFormErrors } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getAxiosErrorMessage } from "src/lib";
import { taskService } from "src/services/task.service";
import * as yup from "yup";

interface ITaskStatus {
  _id: string;
  Key: string;
  label: string;
  description?: string;
  systemStatusKey: string;
}

type Props = {
  selectedStatus: ITaskStatus;
  onDone: () => Promise<any>;
  data: any;
};

const validationSchema = yup.object({
  Key: yup.string().required("required"),
  label: yup.string().required("required"),
  description: yup.string().optional(),
  systemStatusKey: yup.string().required(),
});

const UpdateStatusForm = ({ selectedStatus, onDone, data }: Props) => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [uniq, setUniq] = useState(true);

  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      Key: selectedStatus.Key,
      label: selectedStatus.label,
      description: selectedStatus.description,
      systemStatusKey: selectedStatus.systemStatusKey,
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

  const isKeyUniq = (key) => {
    if (key !== selectedStatus.Key) {
      const uniq = data.every((item) => item.Key !== key);
      setUniq(uniq);
    }
  };

  const handleKeyChange = (e) => {
    isKeyUniq(e.target.value);
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
            name="Key"
            label={t("key")}
            fullWidth
            value={formik.values.Key}
            onChange={(e) => handleKeyChange(e)}
          />
          {!uniq ? (
            <>
              <Typography color={"red"}>Key already exists</Typography>
            </>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item>
          <TextField
            name="label"
            label={t("label")}
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
            label={t("description")}
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
          <FormControl fullWidth>
            <InputLabel id="select">{t("systemStatusKey")}</InputLabel>
            <Select
              label={t("systemStatusKey")}
              name="systemStatusKey"
              value={formik.values.systemStatusKey}
              fullWidth
              labelId="select"
              onChange={handleChange}
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
          </FormControl>
        </Grid>
        <Grid item>
          <Button
            type="submit"
            disabled={formik.isSubmitting}
            fullWidth
            variant="contained"
          >
            {formik.isSubmitting ? <CircularProgress size={18} /> : t("submit")}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default UpdateStatusForm;
