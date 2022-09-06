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
  FormHelperText,
  IconButton,
} from "@mui/material";
import { t } from "i18next";

import { useFormik } from "formik";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { formService } from "src/services/form.service";
import { getAxiosErrorMessage } from "src/lib";
import _ from "lodash";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function FormFieldForm({ onDone }) {
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
    key: yup
      .string()
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "Key should only contain letters , numbers and underscore"
      )
      .required(t("keyIsRequred")),
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

        let errors = [];

        if (type === "radios" || type === "checkboxes" || type === "dropdown") {
          const reduced = options.reduce((acc, x) => {
            return {
              ...acc,
              [x.key]: x.value,
            };
          }, {});

          res.options = reduced;

          if (
            res.defaultValue &&
            !Object.keys(res.options).includes(res.defaultValue)
          ) {
            errors.push("Default value must exist in the options");
          }
        }

        if (type === "textarea") res.rows = rows;
        if (type === "markup" && res.defaultValue) {
          const hasScript = /<script.+>/g.test(res.defaultValue);

          if (hasScript) errors.unshift("Default value invalid");
          else res.defaultValue = _.escape(res.defaultValue);
        }

        if (!errors.length) {
          console.log(res);
          await formService.createField(res);
          await onDone();

          setSuccess("Success");
        } else setError(errors[0]);
      } catch (error) {
        console.log(error);
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
      key: e.target.value.replace(/\s/g, "").toLowerCase(),
      value: e.target.value,
    });

    setOptions(current);
  };

  const setSelectedForm = (e) => {
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
    formik.setFieldValue("defaultValue", "");
  };

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
        sx={{ minHeight: 500 }}
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
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">{t("type")}</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Type"
                onChange={(e) => setSelectedForm(e)}
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
                    onChange={(e) => handleChange(e)}
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
                    onChange={(e) => handleChange(e)}
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
                    onChange={(e) => handleChange(e)}
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
                    onChange={(e) => handleChange(e)}
                    error={
                      formik.touched.placeholder &&
                      Boolean(formik.errors.placeholder)
                    }
                    helperText={
                      formik.touched.placeholder && formik.errors.placeholder
                    }
                    fullWidth
                  ></TextField>
                  {type === "checkboxes" ||
                  type === "dropdown" ||
                  type === "radios" ? (
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel id="defaultvalue">
                        {t("defaultValue")}
                      </InputLabel>
                      <Select
                        labelId="defaultvalue"
                        id="defaultvalue"
                        name="defaultValue"
                        label={t("defaultValue")}
                        onChange={(e) => handleChange(e)}
                        value={formik.values.defaultValue}
                        error={
                          formik.touched.defaultValue &&
                          Boolean(formik.errors.defaultValue)
                        }
                      >
                        {options.map((c) => (
                          <MenuItem key={c.key} value={c.key}>
                            {c.value}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {formik.touched.defaultValue &&
                          formik.errors.defaultValue}
                      </FormHelperText>
                    </FormControl>
                  ) : (
                    <TextField
                      sx={{ mt: 2 }}
                      id="defaultValue"
                      name="defaultValue"
                      label={t("defaultValue")}
                      value={formik.values.defaultValue}
                      onChange={(e) => handleChange(e)}
                      error={
                        formik.touched.defaultValue &&
                        Boolean(formik.errors.defaultValue)
                      }
                      helperText={
                        formik.touched.defaultValue &&
                        formik.errors.defaultValue
                      }
                      fullWidth
                    ></TextField>
                  )}

                  <TextField
                    sx={{ mt: 2 }}
                    id="validation"
                    name="validation"
                    label={t("validation")}
                    value={formik.values.validation}
                    onChange={(e) => handleChange(e)}
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
                    <Box gap={2} display="flex" flexDirection="column" mt={2}>
                      <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography sx={{ mt: 2 }} variant="h5">
                          {t("values")}
                        </Typography>
                        <div>
                          <IconButton
                            disabled={options.length < 2}
                            onClick={removeOption}
                            color="error"
                          >
                            <RemoveIcon />
                          </IconButton>
                          <IconButton onClick={addOption} color="primary">
                            <AddIcon />
                          </IconButton>
                        </div>
                      </Box>
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
                    </Box>
                  ) : (
                    <></>
                  )}
                  <TextField
                    sx={{ mt: 2 }}
                    id="note"
                    name="note"
                    label={t("note")}
                    value={formik.values.note}
                    onChange={(e) => handleChange(e)}
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
