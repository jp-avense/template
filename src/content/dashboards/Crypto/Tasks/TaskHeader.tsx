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
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { agentService } from "src/services/agent.service";
import { IAgent } from "src/contexts/AgentContext";

type Props = {
  filterByMonth: any;
  resetData: any;
  value: string;
  status: any[];
  loading: any;
  setLoading: any;
};

function TaskHeader({
  filterByMonth,
  resetData,
  value,
  status,
  loading,
  setLoading,
}: Props) {
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [agent, setAgent] = useState("");
  const [selectAgent, setSelectAgent] = useState([]);

  const {
    t,
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    setLoading(true);
    agentService
      .getAgents()
      .then(({ data }) => {
        setData(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const getAgent = (raw: any) => {
    // const res: IAgent[] = raw.map((item) => {
    //   const init = {
    //     status: +item.Enabled,
    //   } as IAgent;
    //   return item.Attributes.reduce((acc, curr) => {
    //     acc[curr.Name] = curr.Value;
    //     return acc;
    //   }, init);
    // });
    // return res;
  };

  console.log(data);

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
                  onChange={(e) => getAgent(e)}
                >
                  {status.map((item) => {
                    <MenuItem key={item._id} value={item._id}>
                      {item.assignedTo.agentName}
                    </MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Box>

            <DatePicker
              views={["year", "month"]}
              label={t("filterByMonth")}
              minDate={new Date("2022-01-01")}
              maxDate={new Date("2040-06-01")}
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
