import { Box, MenuItem, Select, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { TaskType } from "../../TaskType/type.interface";

type Props = {
  data?: {
    mode: "create" | "update";
    value: {
      key: string;
      label: string;
      description: string;
      form: string;
    };
  };
  taskTypes: TaskType[];
};

type Values = {
  name: string;
  description: string;
  type: string;
};

const FormGeneralSettings = ({ data, taskTypes }: Props) => {
  const [values, setValues] = useState<Values>({
    name: "",
    description: "",
    type: "",
  });

  useEffect(() => {
    setValues({
      ...values,
      type: data ? data.value.key : "",
    });
  }, []);

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box display="flex" gap={2} flexDirection="column">
      <Box display="flex" gap={1} flexDirection="column">
        <span>Form name</span>
        <TextField
          placeholder="Name"
          fullWidth
          onChange={handleChange}
          name="name"
          value={values.name}
        />
      </Box>
      <Box display="flex" gap={1} flexDirection="column">
        <span>Form description</span>
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
      <Box display="flex" gap={1} flexDirection="column">
        <span>Task type</span>
        <Select
          fullWidth
          onChange={handleChange}
          name="type"
          value={values.type}
          disabled={!!data?.value.key}
        >
          {data?.value.key ? (
            <MenuItem value={data.value.key} selected>
              {data.value.label || data.value.key}
            </MenuItem>
          ) : null}
          {taskTypes.map((item) => (
            <MenuItem key={item.key} value={item.key}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};

export default FormGeneralSettings;
