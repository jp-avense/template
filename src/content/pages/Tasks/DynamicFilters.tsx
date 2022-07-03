import { useContext, useState, useEffect, useMemo } from "react";

import { FilterContext } from "src/contexts/FilterContext";
import { Button, Grid, MenuItem, Select, TextField, Box } from "@mui/material";

import { DatePicker } from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { AgentContext } from "src/contexts/AgentContext";
import { useTranslation } from "react-i18next";
import { TaskDefaultColumns } from "src/consts";
import { isDefaultColumn } from "src/lib";
import { startOfDay } from "date-fns";

const width = {
  width: "200px",
};

const width2 = {
  width: "250px",
};

function DynamicFilter() {
  const { t } = useTranslation();
  const [taskDetails, setTaskDetails] = useState([]);

  const context = useContext(FilterContext);
  const agentContext = useContext(AgentContext);

  const {
    handleAgents: { agents, getAgents },
  } = agentContext;

  const {
    handleFilter: {
      dynamicFilters,
      setDynamicFilters,
      setLoading,
      getDataAndSet,
      types,
      getTypesAndSet,
      status,
      getStatusAndSet,
      details,
    },
  } = context;

  useEffect(() => {
    init(details).then((data) => {
      setTaskDetails(data);
    });
  }, [details]);

  const init = async (initialDetails: any[]) => {
    const map = initialDetails.map(async (item) => {
      const isDefault = isDefaultColumn(item.key);

      if (!isDefault) return item;

      const enums = await getPossibleValues(item.key);

      return {
        ...item,
        enum: enums,
      };
    });

    return Promise.all(map);
  };

  useEffect(() => {
    if (dynamicFilters.length == 0) submitFilter();
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
    return Boolean(dynamicFilters.find((a) => a.selectedType === type));
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
    dup[index].value = "";

    setDynamicFilters(dup);
  };

  const getPossibleValues = async (column: TaskDefaultColumns) => {
    switch (column) {
      case TaskDefaultColumns.AGENT:
        if (agents.length) return agents;
        const agentResponse = await getAgents();
        const mapped = agentResponse
          .filter((item) => {
            const roles = item["custom:role"]?.split(",");

            if (!roles) return false;

            return roles.length === 1 && roles.includes("agent");
          })
          .map((item) => ({
            key: item.sub,
            label: `${item.name} ${item.family_name}`,
          }));
        return mapped;
      case TaskDefaultColumns.TYPE:
        if (types.length) return types;
        const typeResponse = await getTypesAndSet();
        return typeResponse;
      case TaskDefaultColumns.STATUS:
        if (status.length) return status;
        const statusResponse = await getStatusAndSet();
        return statusResponse;
      default:
        return [];
    }
  };

  const changeFilterGroupValue = (e, item) => {
    const index = dynamicFilters.findIndex((a) => a == item);
    const dup = dynamicFilters.slice().map((a) => ({ ...a }));

    const val = e?.target?.value ?? e;

    dup[index].value = val;

    setDynamicFilters(dup);
  };

  const secondLevelClone = (arr) => {
    const slice = arr.slice().map((a) => {
      const reduce = Object.entries(a).reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
          acc[key] = value.slice();
        } else if (typeof value === "object") {
          acc[key] = {
            ...value,
          };
        } else {
          acc[key] = value;
        }

        return acc;
      }, {});

      return reduce;
    });

    return slice;
  };

  const setStartRange = (e: string, item) => {
    const index = dynamicFilters.findIndex((a) => a == item);

    if (!Array.isArray(item.value)) item.value = [];

    const dup = secondLevelClone(dynamicFilters);

    dup[index].value[0] = startOfDay(new Date(e));

    setDynamicFilters(dup);
  };

  const setEndRange = (e: string, item) => {
    const index = dynamicFilters.findIndex((a) => a == item);

    if (!Array.isArray(item.value)) item.value = [];

    const dup = secondLevelClone(dynamicFilters);

    dup[index].value[1] = e;

    setDynamicFilters(dup);
  };

  const deleteFilterGroup = (item) => {
    const clone = dynamicFilters.filter((a) => a != item);

    setDynamicFilters(clone);
  };

  const createValueComponent = (item) => {
    const details = keyComponentMap[item.selectedType];
    let inputType = details ? details.inputType : "none";

    const defaultDropdowns = [
      TaskDefaultColumns.AGENT,
      TaskDefaultColumns.STATUS,
      TaskDefaultColumns.TYPE,
    ];

    if (defaultDropdowns.includes(item.selectedType)) {
      inputType = "dropdown";
    }

    if (item.selectedType === TaskDefaultColumns.CREATED_AT) {
      return (
        <Box display="flex" gap={2}>
          <DatePicker
            value={item.value[0]}
            onChange={(e) => setStartRange(e, item)}
            renderInput={(params) => <TextField {...params} />}
            InputProps={{
              style: width2,
            }}
          />
          {Array.isArray(item.value) && item.value[0] ? (
            <DatePicker
              value={item.value[1]}
              onChange={(e) => setEndRange(e, item)}
              renderInput={(params) => <TextField {...params} />}
              InputProps={{
                style: width2,
              }}
              shouldDisableDate={(date) => {
                const start = item.value[0];
                if (!start || !new Date(start)) return true;

                if (new Date(date) < new Date(start)) {
                  return true;
                }
                return false;
              }}
            />
          ) : null}
        </Box>
      );
    }

    switch (inputType.toLowerCase()) {
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
      case "dropdown":
      case "select":
        return (
          <Select
            value={item.value}
            onChange={(e) => changeFilterGroupValue(e, item)}
            sx={width2}
            displayEmpty
            defaultValue=""
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
                return (
                  <MenuItem value={a.key} key={a.key}>
                    {t(a.label)}
                  </MenuItem>
                );
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
      case "datetimebutton":
      case "datetime":
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
      await getDataAndSet();
    } catch (error) {
      console.log(error);
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
