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
  FormHelperText,
} from "@mui/material";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { getAxiosErrorMessage } from "src/lib";
import { Form } from "../../FormBuilder/form.interface";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const validationSchema = yup.object({
  key: yup.string().required("required"),
  label: yup.string().required("required"),
  inputType: yup.string().required("required"),
  showInTable: yup.boolean().required("required"),
  description: yup.string().optional(),
});

const CreateTaskDetailForm = ({ onDone }) => {
  const { t } = useTranslation();

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      key: "",
      label: "",
      inputType: "",
      showInTable: false,
      description: "",
    },
    onSubmit: async (values, actions) => {
      console.log(values);
      //   try {
      //     setError("");
      //     setSuccess("");
      //     // await taskDetails.createTaskDetails(values);
      //     actions.resetForm();
      //     setSuccess("Added new detail");
      //     await onDone();
      //   } catch (error) {
      //     setError(getAxiosErrorMessage(error));
      //   }
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
              label={t("key")}
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
            <FormControl fullWidth>
              <InputLabel id="inputType">{t("inputType")}</InputLabel>
              <Select
                labelId="inputType"
                id="inputType"
                name="inputType"
                label="inputType"
                onChange={(e) => handleChange(e)}
                value={formik.values.inputType}
                error={
                  formik.touched.inputType && Boolean(formik.errors.inputType)
                }
              >
                <MenuItem value="any">{t("any")}</MenuItem>
                <MenuItem value="boolean">{t("boolean")}</MenuItem>
                <MenuItem value="date">{t("date")}</MenuItem>
                <MenuItem value="dropdown">{t("dropdown")}</MenuItem>
                <MenuItem value="number">{t("number")}</MenuItem>
                <MenuItem value="string">{t("string")}</MenuItem>
              </Select>
              <FormHelperText>
                {formik.touched.inputType && formik.errors.inputType}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl fullWidth>
              <InputLabel id="showInTable">{t("showInTable")}</InputLabel>
              <Select
                labelId="showInTable"
                id="showInTable"
                name="showInTable"
                label={t("showInTable")}
                onChange={(e) => handleChange(e)}
                value={formik.values.showInTable}
                error={
                  formik.touched.showInTable &&
                  Boolean(formik.errors.showInTable)
                }
              >
                <MenuItem value={true as any}>{t("true")}</MenuItem>
                <MenuItem value={false as any}>{t("false")}</MenuItem>
              </Select>
              <FormHelperText>
                {formik.touched.showInTable && formik.errors.showInTable}
              </FormHelperText>
            </FormControl>
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
              multiline
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

export default CreateTaskDetailForm;
