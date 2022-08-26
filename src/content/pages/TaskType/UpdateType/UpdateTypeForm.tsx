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
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { getAxiosErrorMessage } from "src/lib";
import { taskService } from "src/services/task.service";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { Form } from "../../FormBuilder/form.interface";
import { TaskType } from "../type.interface";
import { useTranslation } from "react-i18next";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  forms: Form[];
  selectedType: TaskType;
  onFinish: () => Promise<any>;
};

interface IFormOption {
  type: string;
  value: string;
}

const validationSchema = yup.object({
  key: yup
    .string()
    .matches(/^[a-zA-Z0-9_]+$/)
    .required("required"),
  label: yup.string().required("required"),
  description: yup.string().optional(),
});

const UpdateTypeForm = ({ selectedType, onFinish, forms }: Props) => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formOptions, setFormOptions] = useState<IFormOption[]>([]);

  const navigate = useNavigate();

  const { t } = useTranslation();

  useEffect(() => {
    if (selectedType.form && typeof selectedType.form === "object") {
      const res: IFormOption[] = Object.entries(selectedType.form).map(
        ([key, value]: [string, any]) => ({
          type: key,
          value: value?._id ?? "",
        })
      );

      const hasExecute = "execute" in res;

      if (!hasExecute) {
        res["execute"] = "";
      }

      setFormOptions(res);
    }
  }, [selectedType]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      key: selectedType.key,
      label: selectedType.label,
      description: selectedType.description,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError("");
        setSuccess("");

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

        await taskService.updateTaskType(selectedType._id, {
          ...values,
          form: forms,
        });

        setSuccess("Updated Task.");

        await onFinish();
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

  const handleFormChange = (e) => {
    if (e.target.value === "new") {
      return navigate("/create-form", {
        state: {
          selectedType: {
            ...selectedType,
            ...formik.values,
          },
          mode: "update",
        },
      });
    }

    formik.handleChange(e);
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
        <Grid container spacing={3} direction="column">
          <Grid item>
            {error ? <Alert severity="error">{error}</Alert> : null}
            {success ? <Alert severity="success">{success}</Alert> : null}
          </Grid>
          <Grid item>
            <TextField
              name="key"
              label={t("key")}
              defaultValue={selectedType.key}
              fullWidth
              error={formik.touched.key && Boolean(formik.errors.key)}
              helperText={formik.touched.key && formik.errors.key}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item>
            <TextField
              name="label"
              label={t("label")}
              value={formik.values.label}
              error={formik.touched.label && Boolean(formik.errors.label)}
              helperText={formik.touched.label && formik.errors.label}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item>
            <TextField
              name="description"
              label={t("description")}
              value={formik.values.description}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              fullWidth
              onChange={handleChange}
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
              type="submit"
              disabled={formik.isSubmitting}
              fullWidth
              variant="contained"
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

export default UpdateTypeForm;
