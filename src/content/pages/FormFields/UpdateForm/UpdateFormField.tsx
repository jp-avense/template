import { useFormik } from "formik";
import { getAxiosErrorMessage } from "src/lib";
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
  Autocomplete,
  FormControlLabel,
} from "@mui/material";

import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/system";
import { formService } from "src/services/form.service";

import * as yup from "yup";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { taskService } from "src/services/task.service";

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
  taskDetailKey?: string;
}

type Props = {
  selectedForm: IFormType;
  onDone: () => Promise<any>;
};

const validationSchema = yup.object({
  label: yup.string().required("required"),
  description: yup.string().optional(),
});

const UpdateFormField = ({ selectedForm, onDone }: Props) => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [type, setType] = useState("");
  const [rows, setRows] = useState(5);
  const [fieldInCreate, setFieldInCreate] = useState(false);
  const [details, setDetails] = useState([]);
  const [relatedDetail, setRelatedDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (selectedForm.taskDetailKey) {
      setFieldInCreate(true);

      const res = details.find(item => item._id === selectedForm.taskDetailKey) ?? null

      setRelatedDetail(res);
      setInputValue(res?.label ?? "")

    }
  }, [selectedForm, details]);

  useEffect(() => {
    const res = details.find((item) => item._id === relatedDetail)?.label || "";
    setInputValue(res);
  }, [relatedDetail]);

  useEffect(() => {
    if (fieldInCreate && details.length === 0) {
      setLoading(true);
      taskService
        .getDetails()
        .then(({ data }) => {
          data.sort((a, b) => a.label.localeCompare(b));

          setDetails(data);
        })
        .finally(() => setLoading(false));
    }
  }, [fieldInCreate]);

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

  const { t } = useTranslation();

  useEffect(() => {
    setType(selectedForm.inputType);
    if (selectedForm.rows) setRows(selectedForm.rows);

    if (selectedForm.options) {
      const res = Object.entries(selectedForm.options).map(
        ([key, value]: [string, any]) => {
          return { key: key, value: value };
        }
      );
      setOptions(res);
    }
  }, [selectedForm]);

  const validationSchema = yup.object({
    label: yup.string(),
    description: yup.string(),
    note: yup.string(),
    validation: yup.string(),
    defaultValue: yup.string(),
    placeholder: yup.string(),
  });


  const formik = useFormik({
    initialValues: {
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

        if(fieldInCreate) res.taskDetailKey = relatedDetail._id

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
          await formService.updateField(selectedForm._id, res);
          await onDone();

          setSuccess("Success");
        } else setError(errors[0]);
      } catch (error) {
        console.log(error);
        setError(getAxiosErrorMessage(error));
      }
    },
  });

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

  const setSelectedForm = (e) => {
    setType(e.target.value);
    setRows(5);
    setOptions([{ key: "", value: "" }]);
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
                    value={selectedForm.key}
                    fullWidth
                    disabled
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
                          sx={{ mr: 1 }}
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
                      <div>
                        {options.map((c, index) => (
                          <>
                            <TextField
                              sx={{ mt: 1 }}
                              key={index}
                              id="option"
                              name="option"
                              value={c.value}
                              onChange={(e) => optionsValue(e, index)}
                              fullWidth
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
                  <Box mt={2} display="flex" flexDirection="column" gap={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={fieldInCreate}
                          onChange={(e) => setFieldInCreate(e.target.checked)}
                        />
                      }
                      label={t("useInCreateForm")}
                    />
                    {fieldInCreate && (
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={details}
                        fullWidth
                        blurOnSelect
                        disabled={loading}
                        value={relatedDetail}
                        inputValue={inputValue}
                        onChange={(e, value) => {
                          setRelatedDetail(value);
                        }}
                        onInputChange={(e, value) => {
                          setInputValue(value);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              loading ? t("loading") : t("relatedTaskDetail")
                            }
                            placeholder={loading && t("loading")}
                          />
                        )}
                      />
                    )}
                  </Box>
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
};

export default UpdateFormField;
