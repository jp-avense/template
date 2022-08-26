import { useState, useEffect } from "react";
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
  Tooltip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useTranslation } from "react-i18next";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { IAgent, parseAgentResponse } from "src/contexts/AgentContext";

type Props = {
  filterByMonth: any;
  resetData: any;
  value: string;
  status: any[];
  setFilteredData: any;
  agents: IAgent[];
  loading: boolean;
  selectedAgent: any;
  setSelectedAgent: any;
  setValue: any;
};

function ReportsHeader({
  filterByMonth,
  resetData,
  value,
  status,
  setFilteredData,
  agents,
  loading,
  selectedAgent,
  setSelectedAgent,
  setValue,
}: Props) {
  const [dataAgent, setDataAgent] = useState([]);
  // const [selectedAgent, setSelectedAgent] = useState("");

  const {
    t,
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    setDataAgent(agents);
  }, [agents]);

  const getAgent = (e) => {
    const getVal = e.target.value;
    const d = status.filter((item) => {
      const fac = item.assignedTo.agentName;
      return fac === getVal;
    });
    setSelectedAgent(getVal);
    setFilteredData(d);
    setValue(null);
  };

  const reset = () => {
    setSelectedAgent("");
    resetData();
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
            {t("reports")}
          </Typography>
          <Box display="flex" alignItems="center">
            <Box sx={{ width: 270 }} mr={2}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  {t("filterByAgent")}
                </InputLabel>
                <Select
                  onChange={(e) => getAgent(e)}
                  id="user"
                  labelId="user"
                  label={t("filterByAgent")}
                  value={selectedAgent}
                  disabled={loading}
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
              disabled={loading}
              value={value}
              onChange={(e) => filterByMonth(e)}
              renderInput={(params) => (
                <TextField {...params} helperText={null} />
              )}
            />
            <Box ml={2}>
              <Tooltip title="Reset filter" placement="top">
                <Button onClick={reset}>
                  <RestartAltIcon />
                </Button>
              </Tooltip>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default ReportsHeader;
