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
import { getAxiosErrorMessage } from "src/lib";

function CreateForm() {
  const [loading, setLoading] = useState(false);
  const [fieldForms, setFieldForms] = useState([]);
  const [dragData, setDragData] = useState([]);
  const [drag, setDrag] = useState(null);

  useEffect(() => {
    setLoading(true);
    formService
      .getFields()
      .then(({ data }) => {
        const h = Object.keys(data[0])
          .filter((item) => item !== "_id")
          .map((item) => {
            return {
              key: item,
              label: item.charAt(0).toUpperCase() + item.slice(1),
            };
          });
        setFieldForms(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const onDragEnter = (e, data: string) => {
    if (data === drag) return;
    // e.currentTarget.classList.add("drag-target");
    // console.log(data);
  };

  const onDragStart = (e, id: string) => {
    e.dataTransfer.effectAllowed = "move";
    setDrag(id);
    // console.log(id);
  };

  const onDragLeave = (e) => {
    e.currentTarget.classList.remove("drag-target");
  };

  const onDrop = (e, dragTarget: string) => {
    e.currentTarget.classList.remove("drag-target");

    if (dragTarget !== drag) handleDragDrop(e);

    setDrag("");

    // console.log("dropped");
  };

  const handleDragDrop = (e) => {
    const res = {
      key: drag,
      conditions: {},
      rules: {},
    };

    const data = [...dragData, res];

    setDragData(data);

    console.log(data);
  };

  // const handleDragDrop = (e, source, target) => {
  //   const sourceidx = fieldForms.findIndex((item) => item._id === source);
  //   const targetidx = fieldForms.findIndex((item) => item._id === target);

  //   const sourceObj = fieldForms[sourceidx];
  //   const targetObj = fieldForms[targetidx];

  //   const newSource = {
  //     ...targetObj,
  //     order: sourceObj.order,
  //   };

  //   const newTarget = {
  //     ...sourceObj,
  //     order: targetObj.order,
  //   };

  //   try {
  //     const data = [
  //       {
  //         id: newSource._id,
  //         newOrder: newSource.order,
  //       },
  //       {
  //         id: newTarget._id,
  //         newOrder: newTarget.order,
  //       },
  //     ];
  //     formService.getFields();
  //   } catch (err) {
  //     Swal.fire({
  //       icon: "error",
  //       text: getAxiosErrorMessage(err),
  //       title: "Error",
  //     });
  //   }
  // };

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
              onDragEnter={onDragEnter}
              onDragStart={onDragStart}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            />
          </Grid>
          <Grid item xs={6}>
            <Playground data={dragData} fields={fieldForms} onDrop={onDrop} />
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
