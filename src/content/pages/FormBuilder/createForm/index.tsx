import Playground from "./Playground";
import FormFieldPicker from "./FormFieldPicker";
import FormFieldSettings from "./FormFieldSettings";
import {
  Box,
  CircularProgress,
  Grid,
  TableCell,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { formService } from "src/services/form.service";
import Swal from "sweetalert2";
import { useLocation } from "react-router";
import { getAxiosErrorMessage } from "src/lib";
import { taskService } from "src/services/task.service";
import { TaskType } from "../../TaskType/type.interface";

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

  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    init();
  }, []);

  useEffect(() => {
    const currentIndex = dragData.findIndex((c) => c.key === selected[0]);

    setSelectedData([{ _id: selected[0], index: currentIndex }]);
    let availForms = [];
    for (let i = 0; i < currentIndex; i++) {
      availForms.push(dragData[i].key);
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
    if (dragTarget !== drag.id && drag.sidebar) handleDragDrop(e);

    setDrag("");
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

  console.log("fieldSettings", fieldSettings);
  return (
    <>
      {loading ? (
        <Box mt={8} display="flex" justifyContent="center">
          <CircularProgress size={40} />
        </Box>
      ) : (
        <Grid container>
          <Grid item xs={3}>
            <FormFieldPicker
              onDragStart={onDragStart}
              onDragEnter={onDragEnter}
            />
          </Grid>
          <Grid item xs={6}>
            <Playground
              data={dragData}
              fields={fieldForms}
              setSelected={setSelected}
              onDragOver={onDragOver}
              onDrop={onDrop}
              handleDragDropPlayground={handleDragDropPlayground}
            />
          </Grid>
          <Grid item xs={3}>
            <FormFieldSettings
              generalData={location.state as any}
              taskTypes={types}
              activeForms={activeForms}
              setFieldSettings={setFieldSettings}
              selected={selectedData}
              fieldSettings={fieldSettings}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default CreateForm;
