import {
  Grid,
  Button,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Typography,
  Checkbox,
  CircularProgress,
  Alert,
} from "@mui/material";
import { t } from "i18next";

import { useFormik } from "formik";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { formService } from "src/services/form.service";
import { getAxiosErrorMessage } from "src/lib";

function FormFieldForm() {
  const [type, setType] = useState("");
  const [rows, setRows] = useState(5);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [options, setOptions] = useState([{ key: "", value: "" }]);
  const types = [
    "text",
    "textarea",
    "markup",
    "dateTimeRegister",
    "attachButton",
    "cameraButton",
    "radios",
    "checkboxes",
    "dropdown",
    "dateTimePicker",
    "button",
    "signature",
    "geo",
  ];

  const validationSchema = yup.object({
    key: yup.string().required(t("keyIsRequred")),
    label: yup.string(),
    description: yup.string(),
    note: yup.string(),
    validation: yup.string(),
    defaultValue: yup.string(),
    placeholder: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      label: "",
      key: "",
      description: "",
      note: "",
      validation: "",
      defaultValue: "",
      placeholder: "",
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

        setSuccess("Success");
      } catch (error) {
        setError(getAxiosErrorMessage(error));
      }
    },
  });

  useEffect(() => {
    setRows(5);
    setOptions([{ key: "", value: "" }]);
  }, [type]);

  const optionsValue = (e, index) => {
    let current = options.slice().map((item) => {
      return { ...item };
    });

    current.splice(index, 1, {
      key: e.target.value.replace(" ", ""),
      value: e.target.value,
    });
    setOptions(current);
  };

  const setSelectedTask = (e) => {
    setType(e.target.value);
  };

  const addOption = () => {
    let current = options.slice();
    current.push({ key: "", value: "" });
    setOptions(current);
  };

  const removeOption = () => {
    let current = options.slice();
    current.splice(current.length - 1, 1);
    setOptions(current);
  };

  return (
    <>
      <Grid
        container
        direction="column"
        spacing={1}
        paddingBottom={1}
        paddingLeft={1}
        sx={{ minHeight: 500 }}
      >
        <Grid item>
          <form onSubmit={formik.handleSubmit} style={{ paddingTop: "1rem" }}>
            { error ? <Alert severity="error" sx={{ mb: 2 }}>{ error }</Alert> : null}
            { success ? <Alert severity="success" sx={{ mb: 2 }}>{ success  }</Alert> : null}
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">{t("type")}</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Type"
                onChange={(e) => setSelectedTask(e)}
                value={type}
              >
                {types.map((c) => (
                  <MenuItem key={c} value={c}>
                    {t(c)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {type ? (
              <>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    id="key"
                    name="key"
                    label={t("key")}
                    value={formik.values.key}
                    onChange={formik.handleChange}
                    error={formik.touched.key && Boolean(formik.errors.key)}
                    helperText={formik.touched.key && formik.errors.key}
                    fullWidth
                  ></TextField>
                  <TextField
                    sx={{ mt: 2 }}
                    id="label"
                    name="label"
                    label={t("label")}
                    value={formik.values.label}
                    onChange={formik.handleChange}
                    error={formik.touched.label && Boolean(formik.errors.label)}
                    helperText={formik.touched.label && formik.errors.label}
                    fullWidth
                  ></TextField>
                  <TextField
                    sx={{ mt: 2 }}
                    id="description"
                    name="description"
                    label={t("description")}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.description &&
                      Boolean(formik.errors.description)
                    }
                    helperText={
                      formik.touched.description && formik.errors.description
                    }
                    fullWidth
                  ></TextField>
                  <TextField
                    sx={{ mt: 2 }}
                    id="placeholder"
                    name="placeholder"
                    label={t("placeholder")}
                    value={formik.values.placeholder}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.placeholder &&
                      Boolean(formik.errors.placeholder)
                    }
                    helperText={
                      formik.touched.placeholder && formik.errors.placeholder
                    }
                    fullWidth
                  ></TextField>
                  <TextField
                    sx={{ mt: 2 }}
                    id="defaultValue"
                    name="defaultValue"
                    label={t("defaultValue")}
                    value={formik.values.defaultValue}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.defaultValue &&
                      Boolean(formik.errors.defaultValue)
                    }
                    helperText={
                      formik.touched.defaultValue && formik.errors.defaultValue
                    }
                    fullWidth
                  ></TextField>
                  <TextField
                    sx={{ mt: 2 }}
                    id="validation"
                    name="validation"
                    label={t("validation")}
                    value={formik.values.validation}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.validation &&
                      Boolean(formik.errors.validation)
                    }
                    helperText={
                      formik.touched.validation && formik.errors.validation
                    }
                    fullWidth
                  ></TextField>
                  {type === "textarea" ? (
                    <>
                      <TextField
                        sx={{ mt: 2 }}
                        type="number"
                        name="note"
                        inputProps={{ min: 1 }}
                        label={t("rows")}
                        value={rows}
                        onChange={(e) => setRows(parseInt(e.target.value))}
                        fullWidth
                        required
                      ></TextField>
                    </>
                  ) : (
                    <></>
                  )}
                  {type === "radios" ||
                  type === "checkboxes" ||
                  type === "dropdown" ? (
                    <>
                      <Typography sx={{ mt: 2 }} variant="h5">
                        {t("values")}
                      </Typography>
                      <div>
                        <Button
                          disabled={options.length < 2}
                          onClick={removeOption}
                          variant="contained"
                        >
                          -
                        </Button>
                        <Button onClick={addOption} variant="contained">
                          +
                        </Button>
                      </div>
                      <div style={{ display: "inline-grid" }}>
                        {options.map((c, index) => (
                          <>
                            <TextField
                              key={index}
                              id="option"
                              name="option"
                              value={c.value}
                              defaultValue={c.value}
                              onChange={(e) => optionsValue(e, index)}
                              required
                            ></TextField>
                          </>
                        ))}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  <TextField
                    sx={{ mt: 2 }}
                    id="note"
                    name="note"
                    label={t("note")}
                    value={formik.values.note}
                    onChange={formik.handleChange}
                    error={formik.touched.note && Boolean(formik.errors.note)}
                    helperText={formik.touched.note && formik.errors.note}
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
              </>
            ) : (
              <></>
            )}
          </form>
        </Grid>
      </Grid>
    </>
  );
}

export default FormFieldForm;
