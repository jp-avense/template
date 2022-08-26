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
import { useContext, useMemo, useState } from "react";
import { FilterContext } from "src/contexts/FilterContext";
import { useTranslation } from "react-i18next";
import Modals from "../Components/Modals";
import { taskService } from "src/services/task.service";
import { getAxiosErrorMessage } from "src/lib";

type Props = {
  selected: string;
};

const UpdateTaskForm = ({ selected }: Props) => {
  const { t } = useTranslation();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const context = useContext(FilterContext);
  const [open, setOpenPopup] = useState(false);

  const handleClose = () => {
    setOpenPopup(false);
  };
  const handleOpen = () => {
    setOpenPopup(true);
  };

  const {
    handleFilter: {
      details,
      originalData,
      status,
      types,
      getDataByFilters,
      setOriginalData,
    },
  } = context;

  const taskObj = useMemo(() => {
    let res = originalData.filter((item) => selected.includes(item._id));
    return res[0];
  }, [originalData, selected]);

  const taskDeets = taskObj.taskDetails;

  const statusId = taskDeets.find((item) => item.key === "statusId")?.value;

  const detailsMapping = useMemo(() => {
    return taskDeets.reduce((acc, x) => {
      acc[x.key] = x;

      return acc;
    }, {});
  }, [taskDeets]);

  const initialValues = details
    ? details.reduce((acc, x) => {
        const { key } = x;

        acc[key] = detailsMapping[key].value;

        return acc;
      }, {})
    : {};

  const sortedDetails = useMemo(() => {
    const d = details.slice();
    d.sort((a, b) => {
      if (a.order == null) return 1;
      if (b.order == null) return -1;

      return a.order - b.order;
    });

    return d;
  }, [details]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: async (values) => {
      try {
        setError("");
        setSuccess("");

        if (statusId !== "new" && statusId !== "assigned") {
          setError(t("updateOnlyIfNew"));
          return;
        }

        delete values.assignedTo;
        delete values.createdAt;

        const newDetails = Object.entries(values).map(
          ([key, value]: [string, any]) => {
            return {
              key,
              value,
              fromDefaultProp: detailsMapping[key].fromDefaultProp,
            };
          }
        );

        const newTaskObj = Object.entries(taskObj).reduce(
          (acc, [key, value]: [string, any]) => {
            if (!(key in detailsMapping)) {
              acc[key] = value;
            } else if (detailsMapping[key].fromDefaultProp) {
              acc[key] = values[key];
            }

            return acc;
          },
          {}
        );

        const res = {
          ...newTaskObj,
          taskDetails: newDetails,
        };

        await taskService.updateTask(selected, res);

        setSuccess(t("success"));
        const { data: resp } = await getDataByFilters();
        setOriginalData(resp.tasks);
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

  const createRows = (formik) => {
    if (taskDeets.length == 0) return [];

    return sortedDetails.map((item) => {
      const type = item.inputType;
      const { key } = item;

      const currentItemDetail = detailsMapping[item.key];

      if (key === "createdAt" || key === "assignedTo") return null;
      if (key === "statusId") {
        return (
          <TextField
            select
            name="statusId"
            label={t("status")}
            fullWidth
            value={formik.values[item.key]}
            onChange={handleChange}
          >
            {status.map((item) => (
              <MenuItem key={item.Key} value={item.Key}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        );
      }
      if (key === "taskType") {
        return (
          <TextField
            select
            label={t("type")}
            name="taskType"
            fullWidth
            value={formik.values[item.key]}
            onChange={handleChange}
          >
            {types.map((type) => (
              <MenuItem key={type.key} value={type.label}>
                {type.label}
              </MenuItem>
            ))}
          </TextField>
        );
      }

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
              defaultValue={currentItemDetail.value}
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
              value={formik.values[item.key] || currentItemDetail.value}
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
              defaultValue={currentItemDetail.value}
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
          return null;
      }
    });
  };

  const rows = createRows(formik);

  return (
    <>
      <Modals open={open} onClose={handleClose} title={t("updateTask")}>
        {statusId !== "new" && statusId !== "assigned" ? (
          <Alert severity="warning">{t("updateOnlyIfNew")}</Alert>
        ) : details.length < 1 ? (
          <>No details found for task</>
        ) : (
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
                  {formik.isSubmitting ? (
                    <CircularProgress size={19} />
                  ) : (
                    t("submit")
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Modals>
      <Button variant="contained" onClick={handleOpen}>
        {t("updateTask")}
      </Button>
    </>
  );
};

export default UpdateTaskForm;
