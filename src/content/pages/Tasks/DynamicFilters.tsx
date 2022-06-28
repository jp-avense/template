import { useContext, useState, useEffect, useMemo } from "react";

import { FilterContext } from "src/contexts/FilterContext";
import { Button, Grid, MenuItem, Select, TextField, Box } from "@mui/material";

import { DatePicker } from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { taskService } from "src/services/task.service";
import {
  AgentContext,
  IAgent,
  parseAgentResponse,
} from "src/contexts/AgentContext";
import { agentService } from "src/services/agent.service";
import { useTranslation } from "react-i18next";

const width = {
  width: "200px",
};

const width2 = {
  width: "250px",
};

const insertAdditional = (data, agents: IAgent[]) => {
  const dup = data.slice();
  const subs = agents.map((item) => ({ value: item.sub, label: item.name }));
  const additional = [
    {
      key: "assignedTo",
      label: "Agent",
      inputType: "enum",
      enum: subs,
    },
  ];
  const res = dup.concat(additional);
  return res;
};

function DynamicFilter() {
  const { t } = useTranslation();
  const [taskDetails, setTaskDetails] = useState([]);

  const context = useContext(FilterContext);
  const agentContext = useContext(AgentContext);

  const {
    handleAgents: { agents, setAgents },
  } = agentContext;

  const {
    handleFilter: {
      setDetails,
      setOriginalData,
      dynamicFilters,
      setDynamicFilters,
      setTotal,
      getDataByFilters,
      setLoading,
    },
  } = context;

  useEffect(() => {
    taskService.getDetails().then(({ data }) => {
      setDetails(data);

      if (agents.length == 0)
        return agentService.getAgents().then(({ data: agentResponse }) => {
          const agents = parseAgentResponse(agentResponse);
          const taskData = insertAdditional(data, agents);

          setTaskDetails(taskData);
          setAgents(agents);
        });

      const res = insertAdditional(data, agents);
      setTaskDetails(res);
    });
  }, []);

  useEffect(() => {
    if (dynamicFilters.length == 0) {
      submitFilter();
    }
  }, [dynamicFilters]);

  const keyComponentMap = useMemo(() => {
    return taskDetails.reduce((acc, item) => {
      acc[item.key] = item;
      return acc;
    }, {});
  }, [taskDetails]);

  const addFilterGroup = () => {
    if (dynamicFilters.length == taskDetails.length) return;

    const group = {
      selectedType: "none",
      value: "",
    };

    const res = [...dynamicFilters, group];

    setDynamicFilters(res);
  };

  const typeExists = (type) => {
    return dynamicFilters.find((a) => a.selectedType === type);
  };

  const changeFilterGroupType = (e, item) => {
    const { value } = e.target;
    const exists = typeExists(value);
    if (exists) return;

    const index = dynamicFilters.findIndex((a) => a == item);

    const dup = dynamicFilters.slice().map((a) => ({ ...a }));

    dup[index].selectedType = value;
    dup[index].componentType =
      value === "none" ? "none" : keyComponentMap[value].inputType;

    setDynamicFilters(dup);
  };

  const changeFilterGroupValue = (e, item) => {
    const index = dynamicFilters.findIndex((a) => a == item);
    const dup = dynamicFilters.slice().map((a) => ({ ...a }));

    const val = e?.target?.value ?? e;

    dup[index].value = val;

    setDynamicFilters(dup);
  };

  const deleteFilterGroup = (item) => {
    const clone = dynamicFilters.filter((a) => a != item);

    setDynamicFilters(clone);
  };

  const createValueComponent = (item) => {
    const details = keyComponentMap[item.selectedType];
    const inputType = details ? details.inputType : "none";

    switch (inputType) {
      case "boolean":
        return (
          <Select
            value={item.value}
            onChange={(e) => changeFilterGroupValue(e, item)}
            sx={width2}
            displayEmpty
            defaultValue={1}
          >
            <MenuItem value={1}>True</MenuItem>
            <MenuItem value={0}>False</MenuItem>
          </Select>
        );
      case "enum":
        return (
          <Select
            value={item.value}
            onChange={(e) => changeFilterGroupValue(e, item)}
            sx={width2}
            displayEmpty
          >
            <MenuItem value="">{t("none")}</MenuItem>
            {details.enum.map((a, idx) => {
              if (typeof a === "string")
                return (
                  <MenuItem value={a} key={idx}>
                    {a}
                  </MenuItem>
                );
              else if (typeof a === "object")
                return <MenuItem value={a.value}>{t(a.label)}</MenuItem>;
            })}
          </Select>
        );
      case "textarea":
      case "text":
      case "string":
        return (
          <TextField
            placeholder={t(details.label)}
            value={item.value}
            onChange={(e) => changeFilterGroupValue(e, item)}
            sx={width2}
          />
        );
      case "date":
        return (
          <DatePicker
            value={item.value}
            onChange={(e) => changeFilterGroupValue(e, item)}
            renderInput={(params) => <TextField {...params} />}
            InputProps={{
              style: width2,
            }}
          />
        );
      case "number":
        return (
          <TextField
            placeholder={t(details.label)}
            value={item.value}
            type="number"
            onChange={(e) => changeFilterGroupValue(e, item)}
            sx={width2}
          />
        );
      default:
        return (
          <Select displayEmpty sx={width2}>
            <MenuItem>{t("none")}</MenuItem>
          </Select>
        );
    }
  };

  const submitFilter = async () => {
    try {
      setLoading(true);
      const { data: res } = await getDataByFilters();
      setOriginalData(res.tasks);
      setTotal(res.totalDocuments);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addFilterGroup}
        >
          {t("addFilter")}
        </Button>
      </Grid>

      {dynamicFilters.map((item, index) => {
        const { selectedType: type } = item;

        const valueComponent = createValueComponent(item);

        return (
          <Grid item key={index}>
            <Box display="flex" gap={1}>
              <Button onClick={() => deleteFilterGroup(item)} size="small">
                <CloseIcon fontSize="small" />
              </Button>
              <Select
                value={type}
                onChange={(e) => {
                  changeFilterGroupType(e, item);
                }}
                sx={width}
                displayEmpty
              >
                <MenuItem value="none">{t("none")}</MenuItem>
                {taskDetails.map((c) => (
                  <MenuItem
                    key={c.key}
                    value={c.key}
                    disabled={typeExists(c.key)}
                  >
                    {t(c.label)}
                  </MenuItem>
                ))}
              </Select>
              {valueComponent}
            </Box>
          </Grid>
        );
      })}
      {dynamicFilters.length ? (
        <Grid item>
          <Button variant="contained" onClick={submitFilter}>
            {t("submitFilter")}
          </Button>
        </Grid>
      ) : null}
    </Grid>
  );
}

export default DynamicFilter;
