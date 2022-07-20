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

function CreateForm() {
  const [loading, setLoading] = useState(false);
  const [fieldForms, setFieldForms] = useState([]);
  const [dragData, setDragData] = useState([]);
  const [drag, setDrag] = useState(null);

  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    formService
      .getFields()
      .then(({ data }) => {
        setFieldForms(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const onDragStart = (e, id: string) => {
    const dragData = {
      id: id,
      sidebar: true,
    };

    e.dataTransfer.effectAllowed = "move";
    e.stopPropagation();
    setDrag(dragData);
  };

  const onDragEnd = (e) => {
    // e.target.classList.remove("drag-source");
  };

  const onDragEnter = (e, id: string) => {
    if (id === drag) return;
    // e.currentTarget.classList.add("drag-target");
    // console.log(drag);
  };

  const onDragOver = (e) => e.preventDefault();

  const onDragLeave = (e) => {
    // e.currentTarget.classList.remove("drag-target");
  };

  const onDrop = (e, dragTarget: string) => {
    // e.currentTarget.classList.remove("drag-target");

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

  // console.log(fieldForms);

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
              onDragEnd={onDragEnd}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
            />
          </Grid>
          <Grid item xs={6}>
            <Playground
              data={dragData}
              fields={fieldForms}
              onDragOver={onDragOver}
              onDrop={onDrop}
              handleDragDropPlayground={handleDragDropPlayground}
            />
          </Grid>
          <Grid item xs={3}>
            <FormFieldSettings />
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default CreateForm;
