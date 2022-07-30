import { useState, useEffect, useContext } from "react";
import {
  Typography,
  Grid,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useTranslation } from "react-i18next";
import MonthPicker from "@mui/x-date-pickers/MonthPicker";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { agentService } from "src/services/agent.service";
import { parseAgentResponse } from "src/contexts/AgentContext";

type Props = {
  filterByMonth: any;
  resetData: any;
  value: string;
  status: any[];
  loading: any;
  setLoading: any;
  setFilteredData: any;
  filteredData: any[];
};

function TaskHeader({
  filterByMonth,
  resetData,
  value,
  status,
  loading,
  setLoading,
  setFilteredData,
  filteredData,
}: Props) {
  const [data, setData] = useState([]);
  const [dataAgent, setDataAgent] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");

  const {
    t,
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    setLoading(true);
    agentService
      .getAgents()
      .then(({ data }) => {
        const x = parseAgentResponse(data);
        setDataAgent(x);
        setData(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const getAgent = (e) => {
    const getVal = e.target.value;
    const d = status.filter((item) => {
      const fac = item.assignedTo.agentName;
      return fac === getVal;
    });
    console.log(d);
    setSelectedAgent(getVal);
    setFilteredData(d);
  };

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
                  onChange={(e) => getAgent(e)}
                  id="user"
                  labelId="user"
                  label={t("user")}
                  value={selectedAgent}
                >
                  {dataAgent.map((item) => (
                    <MenuItem key={item.name} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
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
            <Box ml={2}>
              <Button onClick={resetData}>
                <RestartAltIcon />
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default TaskHeader;
