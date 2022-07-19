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
import { useLocation } from "react-router";

function CreateForm() {
  const [loading, setLoading] = useState(false);
  const [fieldForms, setFieldForms] = useState();
  
  const location = useLocation()


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

  console.log(fieldForms);

  return (
    <>
      {loading ? (
        <Box mt={8} display="flex" justifyContent="center">
          <CircularProgress size={40} />
        </Box>
      ) : (
        <Grid container>
          <Grid item xs={3}>
            <FormFieldPicker />
          </Grid>
          <Grid item xs={6}>
            <Playground />
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
