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
} from "@mui/material";
import { useFormik } from "formik";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { FilterContext } from "src/contexts/FilterContext";

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
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const context = useContext(FilterContext);

  const {
    handleFilter: { details },
  } = context;

  const initialValues = details
    ? details.reduce((acc, x) => {
        const { input_type, key } = x;

        acc[key] = defaultMapping[input_type];

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
      const type = item.input_type;

      switch (type.toLowerCase()) {
        case "enum":
          return (
            <Select
              fullWidth
              label={item.label}
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
          );
        case "string":
        case "text":
          return (
            <TextField
              label={item.label}
              defaultValue=""
              fullWidth
              value={formik.values[item.key]}
              name={item.key}
              onChange={handleChange}
            />
          );
        case "date":
          return (
            <DatePicker
              value={formik.values[item.key] || null}
              label={item.label}
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
              placeholder={item.label}
              value={formik.values[item.key]}
              onChange={handleChange}
              label={item.label}
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
              label={item.label}
            />
          );

        case "textarea":
          return (
            <TextField
              label={item.label}
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

  if (!details) {
    return <>No details about the task yet.</>;
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
            {formik.isSubmitting ? <CircularProgress size={19} /> : "Submit"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateTaskForm;
