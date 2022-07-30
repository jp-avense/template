import { useFormik } from "formik";
import { getAxiosErrorMessage } from "src/lib";
import {
  Grid,
  Button,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";

import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { formService } from "src/services/form.service";

import * as yup from "yup";
import { useTranslation } from "react-i18next";

interface KeyValuePair {
  key: string;
  value: any;
}

interface IFormType {
  _id: string;
  key: string;
  label?: string;
  description?: string;
  inputType: string;
  rows?: number;
  options?: KeyValuePair[];
  placeholder?: string;
  defaultValue?: string;
  validation?: string;
  note?: string;
}

type Props = {
  selectedForm: IFormType;
  onFinish: () => Promise<any>;
};

const validationSchema = yup.object({
  label: yup.string().required("required"),
  description: yup.string().optional(),
});

const DuplicateFormField = ({ selectedForm, onFinish }: Props) => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [type, setType] = useState("");
  const [rows, setRows] = useState(5);

  const [options, setOptions] = useState([{ key: "", value: "" }]);

  const { t } = useTranslation();

  useEffect(() => {
    setType(selectedForm.inputType);
    if (selectedForm.rows) setRows(selectedForm.rows);

    if (selectedForm.options) {
      setOptions(selectedForm.options);
    }
  }, [selectedForm]);

  const validationSchema = yup.object({
    key: yup
      .string()
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "Key should only contain letters , numbers and underscore"
      )
      .required(t("keyIsRequred")),
  });

  const formik = useFormik({
    initialValues: {
      key: "",
      label: selectedForm.label,
      description: selectedForm.description,
      note: selectedForm.note,
      validation: selectedForm.validation,
      defaultValue: selectedForm.defaultValue,
      placeholder: selectedForm.placeholder,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setError("");
        setSuccess("");

        const res = { ...values } as any;
        res.inputType = type;

        if (type === "radios" || type === "checkboxes" || type === "dropdown")
          res.options = options;

        if (type === "textarea") res.rows = rows;

        await formService.createField(res);
        await onFinish();

        setSuccess("Success");
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
      <Grid
        container
        direction="column"
        spacing={1}
        paddingBottom={1}
        paddingLeft={1}
        sx={{ minHeight: 300 }}
      >
        <Grid item>
          <form onSubmit={formik.handleSubmit} style={{ paddingTop: "1rem" }}>
            {error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : null}
            {success ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            ) : null}
            <Alert severity="info">{t("duplicateInfo")}</Alert>
            <Box sx={{ mt: 2 }}>
              <TextField
                id="key"
                name="key"
                label={t("key")}
                value={formik.values.key}
                onChange={(e) => handleChange(e)}
                error={formik.touched.key && Boolean(formik.errors.key)}
                helperText={formik.touched.key && formik.errors.key}
                fullWidth
              ></TextField>
            </Box>

            <div style={{ paddingTop: "10px" }}>
              <Button
                color="primary"
                variant="contained"
                fullWidth
                type="submit"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? (
                  <CircularProgress size={18} />
                ) : (
                  t("submit")
                )}
              </Button>
            </div>
          </form>
        </Grid>
      </Grid>
    </>
  );
};

export default DuplicateFormField;
