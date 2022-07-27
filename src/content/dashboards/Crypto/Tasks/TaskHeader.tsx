import { useState } from "react";
import {
  Typography,
  Grid,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useTranslation } from "react-i18next";

function TaskHeader() {
  const [value, setValue] = useState(null);
  const [agent, setAgent] = useState("");

  const {
    t,
    i18n: { language },
  } = useTranslation();

  const handleChange = (e) => {};

  return (
    <>
      <Grid container justifyContent="start" alignItems="center">
        <Grid
          item
          lg={12}
          display="flex"
          justifyContent="space-between"
          alignContent="center"
          mb={2}
        >
          <Typography variant="h3" sx={{ pb: 2 }}>
            {t("tasks")}
          </Typography>
          <Box display="flex" alignItems="center">
            <Box sx={{ width: 270 }} mr={2}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  {" "}
                  {t("filterByAgent")}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={agent}
                  label="Age"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Agent</MenuItem>
                  <MenuItem value={20}>Admin</MenuItem>
                  <MenuItem value={30}>Backoffice</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {/* <Button variant="contained" sx={{ mr: 2 }}>
              {t("filterByAgent")}
            </Button> */}
            {/* {t("filterByMonth")} */}
            <DatePicker
              label={t("filterByDate")}
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default TaskHeader;
