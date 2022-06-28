import { DatePicker } from "@mui/lab";
import {
  Select,
  MenuItem,
  TextField,
  Grid,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { FilterContext } from "src/contexts/FilterContext";
import { useTranslation } from "react-i18next";

const defaultMapping = {
  date: null,
  datetime: null,
  time: null,
  file: null,
  image: null,
  number: 0,
  boolean: false,
  text: "",
  textarea: "",
  enum: "",
};

const CreateTaskForm = () => {
  const { t } = useTranslation();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const context = useContext(FilterContext);

  const {
    handleFilter: { details },
  } = context;

  const initialValues = details
    ? details.reduce((acc, x) => {
        const { inputType, key } = x;

        acc[key] = defaultMapping[inputType];

        return acc;
      }, {})
    : {};

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: async (values, actions) => {
      setError("");
      setSuccess("Feature not implented yet :)");
      actions.resetForm();
    },
  });

  const handleChange = (e) => {
    setSuccess("");
    setError("");
    formik.handleChange(e);
  };

  const createRows = (formik) => {
    const d = details.slice();
    d.sort((a, b) => {
      if (a.order == null) return 1;
      if (b.order == null) return -1;

      return a.order - b.order;
    });

    return d.map((item) => {
      const type = item.inputType;

      switch (type.toLowerCase()) {
        case "enum":
          return (
            <FormControl fullWidth>
              <InputLabel id={item.key}>{item.label}</InputLabel>
              <Select
                fullWidth
                labelId={item.key}
                label={item.label}
                id={item.key}
                name={item.key}
                value={formik.values[item.key]}
                onChange={handleChange}
              >
                <MenuItem value="">None</MenuItem>
                {item.enum.map((a, idx) => (
                  <MenuItem key={idx} value={a}>
                    {a}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        case "string":
        case "text":
          return (
            <TextField
              label={t(item.label)}
              defaultValue=""
              fullWidth
              value={formik.values[item.key]}
              name={item.key}
              onChange={handleChange}
            />
          );
        case "date":
        case "datetime":
          return (
            <DatePicker
              value={formik.values[item.key] || null}
              label={t(item.label)}
              onChange={(e) => formik.setFieldValue(item.key, e)}
              renderInput={(params) => (
                <TextField {...params} name={item.key} fullWidth />
              )}
            />
          );
        case "number":
          return (
            <TextField
              name={item.key}
              placeholder={t(item.label)}
              value={formik.values[item.key]}
              onChange={handleChange}
              label={t(item.label)}
              fullWidth
              defaultValue=""
              type="number"
            />
          );

        case "boolean":
          return (
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  name={item.key}
                  value={formik.values[item.key]}
                  onChange={handleChange}
                />
              }
              label={t(item.label)}
            />
          );

        case "textarea":
          return (
            <TextField
              label={t(item.label)}
              multiline
              maxRows={6}
              fullWidth
              value={formik.values[item.key]}
              onChange={(e) => formik.setFieldValue(item.key, e.target.value)}
            />
          );
        default:
          return (
            <Select displayEmpty>
              <MenuItem>None</MenuItem>
            </Select>
          );
      }
    });
  };

  const rows = createRows(formik);

  if (!details.length) {
    return <>No details about the task found.</>;
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      {success ? <Alert severity="success">{success}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="stretch"
        py={2}
      >
        {rows.map((item, indx) => (
          <Grid item key={indx}>
            {item}
          </Grid>
        ))}
        <Grid item>
          <Button
            variant="contained"
            type="submit"
            fullWidth
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? <CircularProgress size={19} /> : t("submit")}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateTaskForm;
