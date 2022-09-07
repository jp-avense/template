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
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FilterContext } from "src/contexts/FilterContext";
import { useTranslation } from "react-i18next";
import { toMap } from "src/lib";
import CustomCreateForm from "./CustomCreateForm";
import DefaultCreateForm from "./DefaultCreateForm";

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
  const [chosenType, setChosenType] = useState("");
  const context = useContext(FilterContext);
  

  const {
    handleFilter: { types, forms },
  } = context;

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

  const getId = async () => {
    setIdLoading(true);
    await getNewTaskId();
    setIdLoading(false);
  };

  const chosenForm = typesMap[chosenType]?.form.create;

  return (
    <>
      <Box display="flex" flexDirection="column" pt={2} gap={2}>
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
              data={chosenForm}
            />
          ) : (
            <DefaultCreateForm formik={formik} setStatus={setStatus} />
          )
        ) : null}
      </Box>
    </>
  );
};

export default CreateTaskForm;
