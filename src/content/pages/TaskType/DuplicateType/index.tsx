import { Alert, Box, TextField } from "@mui/material";
import React, { useState } from "react";
import { TaskType } from "../type.interface";
import LoadingButton from "src/content/pages/Components/LoadingButton";
import { getAxiosErrorMessage } from "src/lib";
import { taskService } from "src/services/task.service";

type Props = {
  onFinish: () => any;
  source: TaskType;
};

const DuplicateTypeForm = ({ onFinish, source }: Props) => {
  const [key, setKey] = useState(source.key);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setSuccess("");

    setKey(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setSuccess("");
      setError("");

      const notValid = Number.isNaN(+key);

      if (notValid) setError("Key must only be numbers");
      else {
        const res = {
          ...source,
          key,
        };

        delete res._id;
        await taskService.createTaskTypes(res);
        await onFinish()
        setSuccess("Success");
      }
    } catch (error) {
      setError(getAxiosErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} pt={2}>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {success ? <Alert severity="success">{success}</Alert> : null}
      <TextField
        label="New key"
        helperText="Enter a new key for the duplicate"
        onChange={handleChange}
        value={key}
        type="number"
      />
      <LoadingButton
        loading={loading}
        loadingSize={18}
        text="Submit"
        onClick={handleSubmit}
        variant="contained"
      ></LoadingButton>
    </Box>
  );
};

export default DuplicateTypeForm;
