import { useContext, useState, useEffect, useMemo } from "react";

import { FilterContext } from "src/contexts/FilterContext";
import {
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";

import { DatePicker } from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { AgentContext } from "src/contexts/AgentContext";
import { useTranslation } from "react-i18next";
import { TaskDefaultColumns } from "src/consts";
import { getAxiosErrorMessage, isDefaultColumn } from "src/lib";
import { startOfDay } from "date-fns";
import swal from "sweetalert2";
import { taskService } from "src/services/task.service";
import Modals from "../Components/Modals";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const width = {
  width: "230px",
};

const width2 = {
  width: "250px",
};

function DynamicFilter() {
  const { t } = useTranslation();
  const [taskDetails, setTaskDetails] = useState([]);

  const context = useContext(FilterContext);
  const agentContext = useContext(AgentContext);
  const [open, setOpen] = useState(false);

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
      status,
      details,
      loading,
      filter,
      setTotal,
      page,
      limit,
      setOriginalData,
    },
  } = context;

  useEffect(() => {
    const deets = init(details);

    deets.sort((a, b) => {
      return a.label.localeCompare(b.label);
    });
    
    setTaskDetails(deets);
  }, [details, types, status, agents]);

  const init = (initialDetails: any[]) => {
    const map = initialDetails.map((item) => {
      const isDefault = isDefaultColumn(item.key);

      if (!isDefault) return item;

      const enums = getPossibleValues(item.key);

      return {
        ...item,
        enum: enums,
      };
    });
    return map;
  };

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

  const getPossibleValues = (column: TaskDefaultColumns) => {
    if (column === TaskDefaultColumns.AGENT) {
      const filtered = agents
        .filter((item) => {
          const roles = item["custom:role"]?.split(",");

          if (!roles) return false;

          return roles.length === 1 && roles.includes("agent");
        })
        .map((item) => ({
          key: item.sub,
          label: `${item.name} ${item.family_name}`,
        }));

      return filtered;
    }
    if (column === TaskDefaultColumns.TYPE) return types;
    if (column === TaskDefaultColumns.STATUS) return status;
    return [];
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

    if (clone.length === 0) {
      setLoading(true);
      taskService
        .getAll({
          statusId: filter === "clear_filters" ? undefined : filter,
          page,
          pageSize: limit,
        })
        .then(({ data }) => {
          setTotal(data.totalDocuments);
          setOriginalData(data.tasks);
        })
        .catch((err) => {
          let msg;

          if (err.response) {
            msg = err.response.data.message;
          } else if (err.request) {
            msg = "No response from server";
          } else {
            msg = "Request failed. Please try again later";
          }

          swal.fire({
            icon: "error",
            title: "Error",
            text: msg,
          });
        })
        .finally(() => setLoading(false));
    }
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
            InputProps={{
              style: width2,
            }}
            renderInput={(params) => (
              <TextField {...params} label="Start date" />
            )}
          />
          {Array.isArray(item.value) && item.value[0] ? (
            <DatePicker
              value={item.value[1]}
              onChange={(e) => setEndRange(e, item)}
              renderInput={(params) => (
                <TextField {...params} label="End Date" />
              )}
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
            {details.enum
              .sort((a, b) => a.label.localeCompare(b.label))
              .map((a, idx) => {
                if (typeof a === "string")
                  return (
                    <MenuItem value={a} key={idx}>
                      {a}
                    </MenuItem>
                  );
                else if (typeof a === "object")
                  return (
                    <MenuItem value={a.key || a.Key} key={a.key || a.Key}>
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

  const submitFilter = async (e?: any, filterObject?: object) => {
    try {
      setLoading(true);
      await getDataAndSet(filterObject);
    } catch (error) {
      swal.fire({
        title: "Error",
        icon: "error",
        text: error.message,
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  };
  const handleOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <Button
          variant="contained"
          startIcon={<FilterAltIcon />}
          onClick={handleOpen}
          disabled={loading}
        >
          {t("filterTask")}
        </Button>
      </Grid>

      <Modals onClose={handleClose} open={open} title={t("filterTask")}>
        <Grid container direction="column">
          <Grid item mb={3}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addFilterGroup}
              disabled={loading}
            >
              <Typography>{t("addFilter")}</Typography>
            </Button>
          </Grid>
          <Grid item>
            {dynamicFilters.map((item, index) => {
              const { selectedType: type } = item;

              const valueComponent = createValueComponent(item);

              return (
                <Grid item key={index}>
                  <Box display="flex" gap={1} mb={2}>
                    <IconButton
                      onClick={() => deleteFilterGroup(item)}
                      color="error"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>

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
          </Grid>
          {dynamicFilters.length ? (
            <Grid item xs={12} mt={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={submitFilter}
                disabled={loading}
              >
                {loading ? <CircularProgress size={18} /> : t("submitFilter")}
              </Button>
            </Grid>
          ) : null}
        </Grid>
      </Modals>
    </Grid>
  );
}

export default DynamicFilter;
