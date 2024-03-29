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
import { useTranslation } from "react-i18next";
import { ShutterSpeedSharp } from "@mui/icons-material";

type Props = {
  selected: string[];
};

const AssignTaskForm = ({ selected }: Props) => {
  const { t } = useTranslation();
  const [open, setOpenPopup] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | Date>("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [filteredAgents, setFilteredAgents] = useState([]);

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
      originalData,
      setOriginalData,
      setTotal,
    },
  } = filter;

  useEffect(() => {
    if (!agents.length) {
      getAgents();
    }
  }, []);

  useEffect(() => {
    if (agents.length > 0) {
      const res = agents.filter((item) => {
        const rolesArr = item["custom:role"].split(",");
        if (rolesArr.includes("agent")) {
          return item;
        }
      });
      setFilteredAgents(res);
    }
  }, [agents]);

  useEffect(() => {
    let res = originalData.filter((item) => selected.includes(item._id));
    setSelectedTasks(res);
  }, [selected]);

  useEffect(() => {
    if (selectedTasks.length === 1) {
      if (
        selectedTasks[0].statusId === "assigned" ||
        selectedTasks[0].statusId === "new"
      ) {
        setIsValid(true);
      } else setIsValid(false);
    } else {
      setIsValid(selectedTasks.every((item) => item.statusId === "new"));
    }
  }, [selectedTasks]);

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
        taskIds: selected,
        agent: selectedAgent,
        admin: user.sub,
        assignDate: selectedDate,
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
      <Modals open={open} onClose={handleClose} title={t("assignTask")}>
        {loading ? (
          <span>Loading users...</span>
        ) : (
          <form onSubmit={handleSubmit} style={{ paddingTop: "1rem" }}>
            <Box gap={2} display="flex" flexDirection="column">
              {success && <Alert severity="success">{success}</Alert>}
              {error && <Alert severity="error">{error}</Alert>}
              {!isValid && <Alert severity="warning">{t("taskWarning")}</Alert>}
              <FormControl fullWidth>
                <InputLabel id="uuser">{t("user")}</InputLabel>
                <Select
                  onChange={(e) => selectAgent(e)}
                  id="user"
                  labelId="user"
                  label={t("user")}
                  fullWidth
                  value={selectedAgent}
                >
                  {filteredAgents.map((a) => (
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
                inputFormat="dd/MM/yyyy"
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <Button
                variant="contained"
                type="submit"
                disabled={submitting || !isValid}
              >
                {submitting ? <CircularProgress size={19} /> : t("submit")}
              </Button>
            </Box>
          </form>
        )}
      </Modals>
      <Button variant="contained" onClick={handleOpen}>
        {t("assignTask")}
      </Button>
    </>
  );
};

export default AssignTaskForm;
