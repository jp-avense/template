import {
  Grid,
  Button,
  CircularProgress,
  Box,
  MenuItem,
  TextField,
  Alert,
} from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";
import ModalButton from "src/components/ModalButton";
import { FilterContext } from "src/contexts/FilterContext";
import { getAxiosErrorMessage, toMap } from "src/lib";
import { settingsService } from "src/services/settings.service";
import { taskService } from "src/services/task.service";
import { InputTypeEnum } from "../FormFields/form-field.interface";
import CustomCreateForm from "./CustomCreateForm";
import DefaultCreateForm from "./DefaultCreateForm";

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
  const [idLoading, setIdLoading] = useState(false);
  const [chosenType, setChosenType] = useState("");
  const [valueBag, setValueBag] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [status, setStatus] = useState({
    state: "",
    message: "",
  });

  const {
    handleFilter: {
      setSettings,
      settings,
      types,
      forms,
      originalData,
      details,
    },
  } = context;

  const showCreateTask = useMemo(
    () =>
      settings?.find((item) => item.key === "showCreateTask")?.value == "true",

    [settings]
  );

  const formMap = useMemo(() => toMap("_id", forms), [forms]);

  const typesMap = useMemo(() => {
    const mapping = toMap("key", types);
    for (const value of Object.values<any>(mapping)) {
      let newFormObj = {
        execute: "",
      };

      if (typeof value.form === "object") {
        newFormObj = Object.entries<string>(value.form).reduce<any>(
          (acc, item) => {
            const [key, formId] = item;

            return {
              ...acc,
              [key]: formMap[formId],
            };
          },
          {}
        );
      } else if (typeof value.form === "string") {
        newFormObj = {
          execute: formMap[value.form],
        };
      }

      value.form = newFormObj;
    }

    return mapping;
  }, [types, formMap]);

  const chosenForm = typesMap[chosenType]?.form.create;

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

      return taskNumber;
    } catch (error) {
      setStatus({
        state: "error",
        message: getAxiosErrorMessage(error),
      });
    }
  };

  const getId = async () => {
    setIdLoading(true);
    const num = await getNewTaskId();
    setValueBag({
      ...valueBag,
      taskId: num,
    });
    setIdLoading(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const temp = Object.entries(valueBag).reduce<any>((acc, [key, value]) => {
        if (value == null || value == "") return acc;

        return {
          ...acc,
          [key]: value,
        };
      }, {});

      await taskService.createTask({
        ...temp,
        taskId: +temp.taskId,
        taskType: chosenType,
      });
      setStatus({
        state: "success",
        message: t("success"),
      });
    } catch (error) {
      setStatus({
        message: getAxiosErrorMessage(error),
        state: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setValueBag({
      ...valueBag,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (chosenType) {
      if (chosenForm) {
        const fields = chosenForm.formFields;

        const res = fields.reduce((acc, item) => {
          const { inputType, key, defaultValue } = item;

          let arrayDefault = defaultValue

          if(inputType === InputTypeEnum.CHECKBOX) {
            arrayDefault = defaultValue ?? []
            arrayDefault = Array.isArray(arrayDefault) ? arrayDefault : [defaultValue]
          }

          if (inputType === InputTypeEnum.CHECKBOX) {
            acc[key] = arrayDefault
          } else {
            acc[key] = defaultValue ?? "";
          }

          return acc;
        }, {});

        setValueBag({
          ...res,
          taskId: valueBag.taskId ?? "",
        });
      } else {
        const defaultProps = Object.keys(originalData[0] || {});

        const res = details.reduce((acc, item) => {
          if (defaultProps.includes(item.key)) return acc;

          return {
            ...acc,
            [item.key]: defaultMapping[item.inputType],
          };
        }, {});

        setValueBag({
          ...res,
          taskId: valueBag.taskId ?? "",
        });
      }
    }
  }, [types, details, originalData, chosenType, chosenForm]);

    console.log('valueBag', valueBag)
  return (
    <>
      <Grid container justifyContent="end">
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
                  onClick={() => handleSubmit()}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <CircularProgress size={20} /> : t("submit")}
                </Button>
              }
            >
              <Box display="flex" flexDirection="column" pt={2} gap={2}>
                {status.message && (
                  <Alert severity={status.state as any}>
                    {Array.isArray(status.message)
                      ? status.message.join("\n")
                      : status.message}
                  </Alert>
                )}
                <Box
                  display="flex"
                  flexDirection="row"
                  gap={2}
                  alignItems="center"
                >
                  <TextField
                    label={t("taskId")}
                    placeholder={t("taskId")}
                    name="taskId"
                    value={valueBag.taskId ?? ""}
                    onChange={handleChange}
                    type="number"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="outlined"
                    onClick={getId}
                    disabled={idLoading}
                    sx={{ flexGrow: 1 }}
                  >
                    {idLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      t("getNewTaskId")
                    )}
                  </Button>
                </Box>
                <TextField
                  select
                  fullWidth
                  label="Type"
                  required
                  onChange={(e) => setChosenType(e.target.value)}
                  value={chosenType}
                >
                  {types.map((item) => {
                    return (
                      <MenuItem key={item.key} value={item.key}>
                        {item.label}
                      </MenuItem>
                    );
                  })}
                </TextField>
                {chosenType ? (
                  chosenForm ? (
                    <CustomCreateForm
                      form={chosenForm}
                      values={valueBag}
                      setValues={setValueBag}
                    />
                  ) : (
                    <DefaultCreateForm
                      values={valueBag}
                      setValues={setValueBag}
                      setStatus={setStatus}
                    />
                  )
                ) : null}
              </Box>
            </ModalButton>
          </Grid>
        ) : null}
      </Grid>
    </>
  );
}

export default PageHeader;
