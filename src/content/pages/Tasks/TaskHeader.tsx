import { Typography, Grid, Button, CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import { useContext, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";
import ModalButton from "src/components/ModalButton";
import { FilterContext } from "src/contexts/FilterContext";
import { getAxiosErrorMessage } from "src/lib";
import { settingsService } from "src/services/settings.service";
import { taskService } from "src/services/task.service";
import CreateTaskForm from "./CreateTaskForm";

const defaultMapping = {
  date: null,
  datetime: null,
  time: null,
  file: null,
  image: null,
  number: 0,
  boolean: false,
  any: null,
  text: "",
  string: "",
  textarea: "",
  enum: "",
};

function PageHeader() {
  const { t } = useTranslation();

  const context = useContext(FilterContext);
  const [status, setStatus] = useState({
    state: "",
    message: "",
  });

  const {
    handleFilter: {
      details,
      originalData,
      setSettings,
      settings,
      setOriginalData,
    },
  } = context;

  const showCreateTask = useMemo(
    () =>
      settings?.find((item) => item.key === "showCreateTask")?.value == "true",
    [settings]
  );

  const initialValues = useMemo(() => {
    if (!details) return {};

    const defaultProperties = Object.keys(originalData[0] || {});

    const init = details.reduce((acc, x) => {
      const { inputType, key } = x;

      if (defaultProperties.includes(key)) return acc;

      acc[key] = defaultMapping[inputType];

      return acc;
    }, {});

    init.taskId = 0;
    init.taskType = "";

    return init;
  }, [details, originalData]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: async (values, actions) => {
      try {
        const { data } = await taskService.createTask({
          ...values,
          taskId: Number(values.taskId),
        });

        setOriginalData([...originalData, data]);

        setStatus({
          state: "success",
          message: t("success"),
        });
      } catch (error) {
        setStatus({
          state: "error",
          message: getAxiosErrorMessage(error),
        });
      }
    },
  });

  const getNewTaskId = async () => {
    try {
      const { data } = await settingsService.getAll();

      setSettings(data);

      const taskNumber = data.find((item) => item.key === "taskNumber")?.value;

      if (taskNumber == null) {
        setStatus({
          state: "error",
          message: t("getTaskIdError"),
        });
        return;
      }

      formik.setFieldValue("taskId", taskNumber);
      formik.setFieldTouched("taskId", true);
    } catch (error) {
      setStatus({
        state: "error",
        message: getAxiosErrorMessage(error),
      });
    }
  };

  return (
    <>
      <Grid container justifyContent="end">
        {/* <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t("tasks")}
          </Typography>
        </Grid> */}

        {showCreateTask ? (
          <Grid item>
            <ModalButton
              title={t("createTask")}
              text={t("createTask")}
              buttonProps={{ variant: "contained" }}
              actions={
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ my: 2 }}
                  onClick={() => formik.handleSubmit()}
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? (
                    <CircularProgress size={20} />
                  ) : (
                    t("submit")
                  )}
                </Button>
              }
            >
              <CreateTaskForm
                formik={formik}
                status={status}
                setStatus={setStatus}
                getNewTaskId={getNewTaskId}
              />
            </ModalButton>
          </Grid>
        ) : (
          <CircularProgress size={20} />
        )}
      </Grid>
    </>
  );
}

export default PageHeader;
