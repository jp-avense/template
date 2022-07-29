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
import MonthPicker from "@mui/x-date-pickers/MonthPicker";

type Props = {
  filterByMonth: any;
};

function TaskHeader({ filterByMonth }: Props) {
  const [value, setValue] = useState(null);
  const [agent, setAgent] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
            <DatePicker
              views={["year", "month"]}
              label={t("filterByMonth")}
              minDate={new Date("2022-01-01")}
              maxDate={new Date("2023-06-01")}
              value={value}
              onChange={(e) => filterByMonth(e)}
              renderInput={(params) => (
                <TextField {...params} helperText={null} />
              )}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default TaskHeader;
