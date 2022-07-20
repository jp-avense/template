import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useFormik } from "formik";
import { taskService } from "src/services/task.service";
import * as yup from "yup";
import { getAxiosErrorMessage } from "src/lib";
import { Form } from "../../FormBuilder/form.interface";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const validationSchema = yup.object({
  key: yup
    .number()
    .required("required")
    .positive()
    .min(1, "Must be at least 1 minimum number"),
  description: yup.string().optional(),
  label: yup.string().required("required"),
});

type Props = {
  forms: Form[];
  onFinish: () => any;
};
const CreateTaskTypeForm = ({ onFinish, forms }: Props) => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { t } = useTranslation();

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      key: "",
      label: "",
      description: "",
      form: "",
    },
    onSubmit: async (values, actions) => {
      try {
        setSuccess("");
        setError("");

        await taskService.createTaskTypes({
          ...values,
          key: values.key.toString(),
        });
        actions.resetForm();
        setSuccess("Added new task type");
        await onFinish();
        return true;
      } catch (error) {
        setError(getAxiosErrorMessage(error));
        return false;
      }
    },
  });

  const handleChange = (e) => {
    setSuccess("");
    setError("");
    formik.handleChange(e);
  };

  const handleFormChange = async (e) => {
    setError("");
    setSuccess("");

    if (e.target.value === "new") {
      const isValidForm = await formik.submitForm();

      if (!isValidForm) {
        formik.setFieldValue("form", "");
        return;
      }

      return navigate("/create-form", {
        state: {
          value: formik.values,
          mode: "create",
        },
      });
    } else formik.handleChange(e);
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
              label={t("key")}
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
              helperText={
                formik.touched.description && formik.errors.description
              }
              fullWidth
            />
          </Grid>
          <Grid item>
            <FormControl fullWidth>
              <InputLabel id="form">{t("form")}</InputLabel>
              <Select
                labelId="form"
                id="form"
                value={formik.values.form}
                label={t("form")}
                name="form"
                onChange={(e) => handleFormChange(e)}
              >
                {forms.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
                <MenuItem value="new">{t("createNewForm")}</MenuItem>
              </Select>
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
              {formik.isSubmitting ? (
                <CircularProgress size={18} />
              ) : (
                t("submit")
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default CreateTaskTypeForm;
