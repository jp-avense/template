import { DatePicker } from "@mui/lab";
import { Select, MenuItem, TextField, Grid, Button } from "@mui/material";
import { useFormik } from "formik";
import React, { useContext, useEffect, useMemo } from "react";
import { FilterContext } from "src/contexts/FilterContext";

type Props = {};

const CreateTaskForm = (props: Props) => {
  const context = useContext(FilterContext);

  const {
    handleFilter: { details },
  } = context;

  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const createRows = () => {
    const d = details.slice();
    d.sort((a, b) => {
      if (a.order == null) return 1;
      if (b.order == null) return -1;

      return a.order - b.order;
    });

    return d.map((item) => {
      const type = item.input_type;

      switch (type) {
        case "enum":
          return (
            <Select
              label="Age"
              fullWidth
              //   label={item.label}
              name={item.key}
              defaultValue=""
              value={formik.values[item.key]}
              onChange={formik.handleChange}
            >
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
              onChange={formik.handleChange}
            />
          );
        case "date":
          return (
            <DatePicker
              value={formik.values[item.key] || ""}
              label={item.label}
              onChange={(e) => formik.setFieldValue(item.key, e)}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  name={item.key}
                  {...params}
                />
              )}
            />
          );
        case "number":
          return (
            <TextField
              name={item.key}
              placeholder={item.label}
              value={formik.values[item.key]}
              onChange={formik.handleChange}
              label={item.label}
              fullWidth
              defaultValue=""
              type="number"
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

  const rows = useMemo(() => {
    return createRows();
  }, [details, formik]);

  if (!details) {
    return <>No details about the task yet.</>;
  }

  return (
    <form onSubmit={formik.handleSubmit}>
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
          <Button variant="contained" type="submit" fullWidth>
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateTaskForm;
