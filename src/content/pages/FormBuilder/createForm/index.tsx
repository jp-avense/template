import Playground from "./Playground";
import FormFieldPicker from "./FormFieldPicker";
import FormFieldSettings from "./FormFieldSettings";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Button,
  Avatar,
  Paper,
  TableCell,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { formService } from "src/services/form.service";
import Swal from "sweetalert2";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { getAxiosErrorMessage } from "src/lib";
import { taskService } from "src/services/task.service";
import { TaskType } from "../../TaskType/type.interface";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next";
import { cloneDeep } from "lodash";
import hebFlag from "../../../../assets/images/icons/hebFlag.svg";
import enFlag from "../../../../assets/images/icons/enFlag.svg";

type Values = {
  name: string;
  description: string;
  type: string;
};

function CreateForm() {
  const [loading, setLoading] = useState(false);
  const [fieldForms, setFieldForms] = useState([]);
  const [dragData, setDragData] = useState([]);
  const [drag, setDrag] = useState(null);
  const [selected, setSelected] = useState([]);
  const [selectedData, setSelectedData] = useState<any>([]);
  const [activeForms, setActiveForms] = useState([]);
  const [fieldSettings, setFieldSettings] = useState([]);
  const [types, setTypes] = useState<TaskType[]>([]);
  const [gSettings, setGSettings] = useState<Values>({
    name: "",
    description: "",
    type: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setLoading(true);
    init();
  }, []);

  useEffect(() => {
    let availForms = [];
    const currentIndex = dragData.findIndex((c) => c.key === selected[0]);
    if (currentIndex > -1) {
      if (selected[0]) {
        const res = fieldForms.find((x) => x._id == selected[0]);
        setSelectedData([
          { _id: selected[0], index: currentIndex, inputType: res.inputType },
        ]);
      }
      for (let i = 0; i < currentIndex; i++) {
        availForms.push(dragData[i].key);
      }
    } else {
      setSelectedData([]);
    }
    if (availForms.length > 0) {
      const current = availForms.map((c) => {
        const res = fieldForms.find((x) => x._id === c);
        return res;
      });
      setActiveForms(current);
    } else setActiveForms([]);
  }, [selected, dragData]);

  const init = async () => {
    try {
      setLoading(true);
      const { data } = await taskService.getTaskTypes();
      setTypes(data);

      const { data: data2 } = await formService.getFields();
      setFieldForms(data2);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: getAxiosErrorMessage(error),
        timer: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const onDragStart = (e, id: string) => {
    const dragData = {
      id: id,
      sidebar: true,
    };

    e.dataTransfer.effectAllowed = "move";
    e.stopPropagation();
    setDrag(dragData);
  };

  const onDragEnter = (e, id: string) => {
    if (id === drag) return;
  };

  const onDragOver = (e) => e.preventDefault();

  const onDrop = (e, dragTarget: string) => {
    if (e.currentTarget.id !== "playground") return;
    if (dragData.find((item) => item.key === drag.id)) return;
    if (dragTarget !== drag.id && drag.sidebar) {
      setSelected([drag.id]);
      handleDragDrop(e);
    }
    setDrag("");
  };

  const handleDelete = (id) => {
    const filtered = dragData.filter((item) => item.key !== id);
    const index = fieldSettings.findIndex((item) => item._id === id);
    const current = fieldSettings.slice();
    current.splice(index, 1);
    console.log(filtered);
    setDragData(filtered);
    setFieldSettings(current);
  };

  const handleDragDrop = (e) => {
    const res = {
      key: drag.id,
      conditions: {},
      rules: {},
    };

    const data = [...dragData, res];

    setDragData(data);
  };

  const handleDragDropPlayground = async (
    e,
    source: string,
    target: string
  ) => {
    const sourceidx = dragData.findIndex((item) => item.key === source);
    const targetidx = dragData.findIndex((item) => item.key === target);

    const targetObj = dragData[targetidx];
    const sourceObj = dragData[sourceidx];
    try {
      const dup = dragData.slice().map((item) => ({ ...item }));

      dup[sourceidx] = targetObj;
      dup[targetidx] = sourceObj;

      setDragData(dup);
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: "Error dragging field forms",
        title: "Error",
      });
    }
    e.stopPropagation();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (dragData.length < 1) {
      setIsSubmitting(false);
      throw new Error("Please add at least one form field");
    }

    const dup = cloneDeep(dragData);

    for (const setting of fieldSettings) {
      const { _id, conditions, rules } = setting;

      console.log(dup);
      console.log(_id);

      const item = dup.find((x) => x.key === _id);

      item.conditions = conditions;
      item.rules = rules;
    }

    for (const d of dup) {
      const { key } = fieldForms.find((item) => item._id === d.key);
      d.key = key;
    }

    try {
      await formService.createForm({
        ...gSettings,
        formFields: dup,
      });
    } catch (error) {
      setIsSubmitting(false);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirection = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <>
      {loading ? (
        <Box mt={8} display="flex" justifyContent="center">
          <CircularProgress size={40} />
        </Box>
      ) : (
        <>
          <Paper>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              px={2}
              py={1}
            >
              <Grid item>
                <Link to="/form-builder">
                  <Button>
                    <ArrowBackIcon />
                  </Button>
                </Link>
              </Grid>
              <Grid item display="flex">
                <Box>
                  <Button
                    onClick={() => handleDirection("en")}
                    startIcon={
                      <Avatar
                        sx={{ width: 24, height: 24 }}
                        variant="square"
                        src={enFlag}
                      />
                    }
                  >
                    {t("english")}
                  </Button>
                </Box>
                <Box>
                  <Button
                    onClick={() => handleDirection("he")}
                    startIcon={
                      <Avatar
                        sx={{ width: 24, height: 24 }}
                        variant="square"
                        src={hebFlag}
                      />
                    }
                  >
                    {t("hebrew")}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Grid container sx={{ position: "relative" }}>
            <Grid item xs={3} sx={{ position: "relative" }}>
              <FormFieldPicker
                onDragStart={onDragStart}
                onDragEnter={onDragEnter}
              />
            </Grid>
            <Grid item xs={6} sx={{ position: "relative" }}>
              <Playground
                data={dragData}
                fields={fieldForms}
                setSelected={setSelected}
                onDragOver={onDragOver}
                onDrop={onDrop}
                selected={selected}
                handleDelete={handleDelete}
                handleDragDropPlayground={handleDragDropPlayground}
              />
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                position: "fixed",
                right: 0,
                height: "100vh",
                width: "100%",
              }}
            >
              <FormFieldSettings
                generalData={location.state as any}
                taskTypes={types}
                activeForms={activeForms}
                setFieldSettings={setFieldSettings}
                selected={selectedData}
                fieldSettings={fieldSettings}
                generalSettings={gSettings}
                setGeneralSettings={setGSettings}
                loading={isSubmitting}
                onSubmit={handleSubmit}
              />
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}

export default CreateForm;
