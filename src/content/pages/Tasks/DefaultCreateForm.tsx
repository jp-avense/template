import {
  Alert,
  Grid,
  Box,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import React, { Dispatch, SetStateAction, useContext } from "react";
import { FilterContext } from "src/contexts/FilterContext";
import { DatePicker } from "@mui/lab";

type Props = {
  formik: any;
  setStatus: Dispatch<
    SetStateAction<{
      state: string;
      message: string;
    }>
  >;
};

const DefaultCreateForm = ({ formik, setStatus }: Props) => {
  const { t } = useTranslation();

  const context = useContext(FilterContext);

  const {
    handleFilter: { details, originalData },
  } = context;

  if (!details.length) {
    return <>No details about the task found.</>;
  }

  const handleChange = (e) => {
    setStatus({
      state: "",
      message: "",
    });
    formik.handleChange(e);
  };

  const createRows = (formik) => {
    const defaultProperties = Object.keys(originalData[0]);

    const d = details
      .slice()
      .filter((item) => !defaultProperties.includes(item.key));

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
        case "time":
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

  return (
    <Grid container spacing={2} direction="column" alignItems="stretch">
      {rows.map((item, indx) => (
        <Grid item key={indx}>
          {item}
        </Grid>
      ))}
    </Grid>
  );
};

export default DefaultCreateForm;
