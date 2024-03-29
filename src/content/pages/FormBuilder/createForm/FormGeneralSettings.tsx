import {
  Alert,
  Box,
  MenuItem,
  Select,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { TaskType } from "../../TaskType/type.interface";
import LoadingButton from "src/content/pages/Components/LoadingButton";
import { useTranslation } from "react-i18next";
import { getAxiosErrorMessage } from "src/lib";
import { AxiosError } from "axios";
import { Form } from "../form.interface";

type Props = {
  data?: {
    mode: "create" | "update";
    value: {
      key: string;
      label: string;
      description: string;
      form: string;
    };
    formTableData: Form;
  };
  taskTypes: TaskType[];
  settings: Values;
  setSettings: React.Dispatch<React.SetStateAction<Values>>;
  onSubmit: () => Promise<any>;
  loading: boolean;
};

type Values = {
  name: string;
  description: string;
  type: string;
  formType: "create" | "execute";
};

const FormGeneralSettings = ({
  data,
  taskTypes,
  settings: values,
  setSettings: setValues,
  onSubmit,
  loading,
}: Props) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { t } = useTranslation();

  useEffect(() => {
    setValues({
      ...values,
      type: data?.value?.key || "",
    });
  }, []);

  const handleChange = (e) => {
    setError("");
    setSuccess("");

    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    try {
      if (!values.name) {
        setError("Name is required");
        return;
      }

      await onSubmit();
      setSuccess(t("success"));
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(getAxiosErrorMessage(error));
      } else setError(error.message);
    }
  };

  return (
    <Box display="flex" gap={2} flexDirection="column">
      {error ? <Alert severity="error">{error}</Alert> : null}
      {success ? <Alert severity="success">{success}</Alert> : null}
      <Box display="flex" gap={1} flexDirection="column">
        <span>{t("formName")}</span>
        <TextField
          placeholder="Name"
          fullWidth
          onChange={handleChange}
          name="name"
          value={values.name}
        />
      </Box>
      <Box display="flex" gap={1} flexDirection="column">
        <span>{t("formDescription")}</span>
        <TextField
          placeholder="Description"
          fullWidth
          multiline
          rows="3"
          onChange={handleChange}
          name="description"
          value={values.description}
        />
      </Box>
      {/* <Box display="flex" gap={1} flexDirection="column">
        <span>{t("formType")}</span>
        <Select
          fullWidth
          onChange={handleChange}
          name="type"
          value={values.formType}
          displayEmpty
        >
          <MenuItem value="create">Create form</MenuItem>
          <MenuItem value="execute">Execution form</MenuItem>
        </Select>
      </Box> */}
      <Box display="flex" gap={1} flexDirection="column" sx={{ flexGrow: 1 }}>
        <span>{t("taskType")}</span>
        <Select
          fullWidth
          onChange={handleChange}
          name="type"
          value={values.type}
          disabled={!!data?.value?.key}
          displayEmpty
        >
          {data?.value?.key ? (
            <MenuItem value={data.value.key} selected>
              {data.value.label || data.value.key}
            </MenuItem>
          ) : null}
          {taskTypes.map((item) => (
            <MenuItem key={item.key} value={item.key}>
              {item.label}
            </MenuItem>
          ))}
          <MenuItem value="">None</MenuItem>
        </Select>
      </Box>
      <LoadingButton
        loading={loading}
        onClick={handleSubmit}
        text={t("submit")}
        loadingSize={18}
        fullWidth
        variant="contained"
      ></LoadingButton>
    </Box>
  );
};

export default FormGeneralSettings;
