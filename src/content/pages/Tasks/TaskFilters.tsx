import { useContext, useEffect, useState } from "react";

import { FilterContext } from "src/contexts/FilterContext";
import {
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { taskService } from "src/services/task.service";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

function TaskFilter() {
  const { t } = useTranslation();
  const [status, setStatus] = useState([]);

  const context = useContext(FilterContext);
  const {
    handleFilter: {
      filter,
      setFilter,
      setLoading,
      getDataAndSet,
      setDynamicFilters,
      status: statuses,
    },
  } = context;

  useEffect(() => {
    setLoading(true);
    const res = statuses.map((c) => {
      return { label: c.label, value: c.Key };
    });
    setStatus(res);
    setLoading(false);
  }, [statuses]);

  const handleRefresh = async () => {
    setLoading(true);

    await getDataAndSet({
      statusId: undefined,
    });
    setLoading(false);
  };

  const handleChange = async (value: string) => {
    if (value === "clear_filters") {
      setFilter("");
      setDynamicFilters([]);
      await handleRefresh();
    } else {
      setFilter(value);
      setLoading(true)
      await getDataAndSet({
        statusId: value,
      });
      setLoading(false)
    }
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">Filter</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Filter"
            onChange={(e) => handleChange(e.target.value)}
            value={filter}
          >
            {status.map((c) => {
              return (
                <MenuItem key={c.value} value={c.value}>
                  {" "}
                  {c.label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <Box ml={1}>
          <Tooltip title="Clear Filters" placement="top">
            <Button onClick={(e) => handleChange("clear_filters")}>
              <RestartAltIcon />
            </Button>
          </Tooltip>
        </Box>
      </Grid>
    </Grid>
  );
}

export default TaskFilter;
