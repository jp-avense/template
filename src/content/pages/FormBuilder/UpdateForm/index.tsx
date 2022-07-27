import { useFormik } from "formik";
import React, { useState } from "react";
import { Form } from "../form.interface";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Select,
  TextField,
  InputLabel,
} from "@mui/material";
import LoadingButton from "../../Components/LoadingButton";

type Props = {
  data: Form;
  onDone?: () => any;
};

const UpdateForm = ({ data }: Props) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { t } = useTranslation();

  const validationSchema = yup.object({
    name: yup.string().required(),
    description: yup.string().optional(),
    type: yup.number(),
  });

  const formik = useFormik({
    initialValues: data,
    validationSchema,
    onSubmit: () => {},
  });
  return (
    <Box flexDirection="column" display="flex" gap={2} pt={2}>
      <TextField
        name="name"
        label={t("name")}
        onChange={formik.handleChange}
        value={formik.values.name || ""}
        error={Boolean(formik.touched.name && formik.errors.name)}
        helperText={formik.errors.name}
      />
      <TextField
        name="description"
        label={t("description")}
        onChange={formik.handleChange}
        value={formik.values.description || ""}
        error={Boolean(formik.touched.description && formik.errors.description)}
        helperText={formik.errors.description}
      />

      <FormControl fullWidth>
        <InputLabel>Type</InputLabel>
        <Select label="Type">
          <MenuItem value={10}>Not yet done</MenuItem>
        </Select>
      </FormControl>

      <LoadingButton
        loading={formik.isSubmitting}
        text={t("submit")}
        loadingSize={18}
        variant="contained"
      ></LoadingButton>
    </Box>
  );
};

export default UpdateForm;
