import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useFormik } from "formik";
import { taskService } from "src/services/task.service";
import * as yup from "yup";
import { getAxiosErrorMessage } from "src/lib";
import { Form } from "../../FormBuilder/form.interface";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const validationSchema = yup.object({
  key: yup.string().required("required"),
  description: yup.string().optional(),
  label: yup.string().required("required"),
});

type Props = {
  forms: Form[];
  onFinish: () => any;
};

interface IFormOption {
  type: string;
  value: string;
}

const CreateTaskTypeForm = ({ onFinish, forms }: Props) => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formOptions, setFormOptions] = useState([
    {
      type: "execute",
      value: "",
    },
  ]);

  const navigate = useNavigate();

  const { t } = useTranslation();

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      key: "",
      label: "",
      description: "",
    },
    onSubmit: async (values, actions) => {
      console.log(values);
      try {
        setSuccess("");
        setError("");

        const forms = formOptions.reduce<any>((acc, x) => {
          return {
            ...acc,
            [x.type]: x.value,
          };
        }, {});

        if (!forms.execute) {
          setError("Provide an execution form");
          return;
        }

        await taskService.createTaskTypes({
          ...values,
          form: forms,
        });

        actions.resetForm();
        setSuccess("Added new task type");

        await onFinish();
        return true;
      } catch (error) {
        setError(getAxiosErrorMessage(error));
        return false;
      }
    },
  });

  const handleChange = (e) => {
    setSuccess("");
    setError("");
    formik.handleChange(e);
  };

  const handleFormChange = async (e) => {
    setError("");
    setSuccess("");

    if (e.target.value === "new") {
      const isValidForm = await formik.submitForm();

      if (!isValidForm) {
        formik.setFieldValue("form", "");
        return;
      }

      return navigate("/create-form", {
        state: {
          value: formik.values,
          mode: "create",
        },
      });
    } else formik.handleChange(e);
  };

  const addFormOption = () => {
    const res = [
      ...formOptions,
      {
        type: "",
        value: "",
      },
    ];

    setFormOptions(res);
  };

  const changeFormOption = (newValue: IFormOption, index: number) => {
    const sliced = formOptions.slice();
    sliced.splice(index, 1, newValue);
    setFormOptions(sliced);
  };

  const deleteFormOption = (e: number) => {
    const sliced = formOptions.slice();
    sliced.splice(e, 1);
    setFormOptions(sliced);
  };

  const usedTypes = formOptions.map((item) => item.type);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            {error ? <Alert severity="error">{error}</Alert> : null}
            {success ? <Alert severity="success">{success}</Alert> : null}
          </Grid>
          <Grid item>
            <TextField
              label={t("key")}
              name="key"
              onChange={(e) => handleChange(e)}
              error={formik.touched.key && Boolean(formik.errors.key)}
              value={formik.values.key}
              helperText={formik.touched.key && formik.errors.key}
              fullWidth
            />
          </Grid>
          <Grid item>
            <TextField
              label={t("label")}
              name="label"
              onChange={(e) => handleChange(e)}
              error={formik.touched.label && Boolean(formik.errors.label)}
              value={formik.values.label}
              helperText={formik.touched.label && formik.errors.label}
              fullWidth
            />
          </Grid>
          <Grid item>
            <TextField
              label={t("description")}
              name="description"
              onChange={(e) => handleChange(e)}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              value={formik.values.description}
              helperText={
                formik.touched.description && formik.errors.description
              }
              fullWidth
            />
          </Grid>
          <Grid item>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <div>Add form</div>
              <IconButton onClick={addFormOption}>
                <AddIcon color="primary" />
              </IconButton>
            </Box>
          </Grid>

          {formOptions.map((item, index) => {
            return (
              <Grid item key={index}>
                <Box display="flex" flexDirection="row" gap={2}>
                  <TextField
                    select
                    fullWidth
                    value={item.type}
                    label={t("formType")}
                    required
                    onChange={(e) =>
                      changeFormOption({ ...item, type: e.target.value }, index)
                    }
                  >
                    <MenuItem
                      value="create"
                      disabled={usedTypes.includes("create")}
                    >
                      Create
                    </MenuItem>
                    <MenuItem
                      value="execute"
                      disabled={usedTypes.includes("execute")}
                    >
                      Execute
                    </MenuItem>
                  </TextField>
                  <TextField
                    select
                    fullWidth
                    label={t("value")}
                    required
                    value={item.value}
                    onChange={(e) =>
                      changeFormOption(
                        { ...item, value: e.target.value },
                        index
                      )
                    }
                  >
                    {forms
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </TextField>
                  <IconButton
                    size="small"
                    onClick={() => deleteFormOption(index)}
                    disabled={item.type === "execute"}
                  >
                    <DeleteIcon></DeleteIcon>
                  </IconButton>
                </Box>
              </Grid>
            );
          })}
          <Grid item>
            <Button
              variant="contained"
              disabled={formik.isSubmitting}
              sx={{ display: "block" }}
              type="submit"
              fullWidth
            >
              {formik.isSubmitting ? (
                <CircularProgress size={18} />
              ) : (
                t("submit")
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default CreateTaskTypeForm;
