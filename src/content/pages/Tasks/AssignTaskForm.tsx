import { DatePicker } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { AgentContext } from "src/contexts/AgentContext";
import { AuthContext } from "src/contexts/AuthContext";
import { FilterContext } from "src/contexts/FilterContext";
import { getAxiosErrorMessage } from "src/lib";
import { taskService } from "src/services/task.service";
import Modals from "../Components/Modals";

type Props = {
  selected: string;
};

const AssignTaskForm = ({ selected }: Props) => {
  const [open, setOpenPopup] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | Date>("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const context = useContext(AgentContext);
  const auth = useContext(AuthContext);
  const filter = useContext(FilterContext);

  const {
    handleAgents: { agents, getAgents },
    handleLoading: { loading },
  } = context;

  const {
    handleUser: { user },
  } = auth;

  const {
    handleFilter: {
      setSelectedRows,
      getDataByFilters,
      setOriginalData,
      setTotal,
    },
  } = filter;

  useEffect(() => {
    if (!agents.length) {
      getAgents();
    }
  }, []);

  const handleClose = () => {
    setOpenPopup(false);
  };
  const handleOpen = () => {
    setOpenPopup(true);
  };

  const selectAgent = (e) => {
    setSelectedAgent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    if (!selectedDate) {
      setError("Please select a date");
      setSubmitting(false);
      return;
    }
    if (!selectedAgent) {
      setError("Please select an agent");
      setSubmitting(false);
      return;
    }

    try {
      await taskService.assign({
        taskId: selected,
        agent: selectedAgent,
        admin: user.sub,
        executionDate:
          typeof selectedDate === "string"
            ? selectedDate
            : selectedDate.toISOString(),
      });
      setSuccess("Successfully assigned agent");
      setSelectedRows([]);
      const { data: res } = await getDataByFilters();
      setOriginalData(res.tasks);
      setTotal(res.totalDocuments);
    } catch (error) {
      console.log(error);
      if (error.response?.data)
        setError(error.response.data.message || "Bad request");
      else if (error.request) setError("No response from server");
      else setError("Unable to submit data. Please try again later");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* @ts-ignore */}
      <Modals open={open} onClose={handleClose} title="Assign task">
        {loading ? (
          <span>Loading agents...</span>
        ) : (
          <form onSubmit={handleSubmit} style={{ paddingTop: "1rem" }}>
            <Box gap={2} display="flex" flexDirection="column">
              {success && <Alert severity="success">{success}</Alert>}
              {error && <Alert severity="error">{error}</Alert>}
              <FormControl fullWidth>
                <InputLabel id="agent">Agent</InputLabel>
                <Select
                  onChange={(e) => selectAgent(e)}
                  id="agent"
                  labelId="agent"
                  label="Agent"
                  fullWidth
                  value={selectedAgent}
                >
                  {agents.map((a) => (
                    <MenuItem key={a.sub} value={a.sub}>
                      {a.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <DatePicker
                value={selectedDate}
                onChange={(e) => setSelectedDate(e)}
                minDate={new Date()}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <Button variant="contained" type="submit" disabled={submitting}>
                {submitting ? <CircularProgress size={19} /> : "Submit"}
              </Button>
            </Box>
          </form>
        )}
      </Modals>
      <Button variant="contained" onClick={handleOpen}>
        Assign Task
      </Button>
    </>
  );
};

export default AssignTaskForm;
