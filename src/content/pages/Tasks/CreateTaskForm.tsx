import { DatePicker } from "@mui/lab";
import {
  Select,
  MenuItem,
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
  Alert,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { FilterContext } from "src/contexts/FilterContext";
import { useTranslation } from "react-i18next";

type Props = {
  formik: any;
  status: {
    state: string;
    message: string;
  };
  setStatus: Dispatch<
    SetStateAction<{
      state: string;
      message: string;
    }>
  >;
  getNewTaskId: () => void;
};

const CreateTaskForm = ({ formik, status, setStatus, getNewTaskId }: Props) => {
  const { t } = useTranslation();
  const [idLoading, setIdLoading] = useState(false);
  const context = useContext(FilterContext);

  const handleChange = (e) => {
    setStatus({
      state: "",
      message: "",
    });
    formik.handleChange(e);
  };

  const {
    handleFilter: { originalData, details, types },
  } = context;

  const getId = async () => {
    setIdLoading(true);
    await getNewTaskId();
    setIdLoading(false);
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

  if (!details.length) {
    return <>No details about the task found.</>;
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      {status.state ? (
        <Alert severity={status.state as any}>{status.message}</Alert>
      ) : null}
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="stretch"
        py={2}
      >
        <Grid item>
          <Box display="flex" flexDirection="row" gap={2} alignItems="center">
            <TextField
              label={t("taskId")}
              placeholder={t("taskId")}
              name="taskId"
              value={formik.values.taskId}
              onChange={formik.handleChange}
              type="number"
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="outlined"
              onClick={getId}
              disabled={idLoading}
              sx={{ flexGrow: 1 }}
            >
              {idLoading ? <CircularProgress size={20} /> : t("getNewTaskId")}
            </Button>
          </Box>
        </Grid>
        <Grid item>
          <TextField
            select
            label={t("type")}
            placeholder={t("type")}
            name="taskType"
            value={formik.values.taskType}
            onChange={formik.handleChange}
            fullWidth
            required
          >
            {types.map((item) => (
              <MenuItem key={item.key} value={item.key}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {rows.map((item, indx) => (
          <Grid item key={indx}>
            {item}
          </Grid>
        ))}
      </Grid>
    </form>
  );
};

export default CreateTaskForm;
