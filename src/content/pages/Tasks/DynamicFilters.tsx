import { useContext, useState, useEffect, useMemo } from "react";

import { FilterContext } from "src/contexts/FilterContext";
import {
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Box,
} from "@mui/material";

import { DatePicker } from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { taskService } from "src/services/task.service";

const width = {
  width: "200px",
};

const width2 = {
  width: "250px",
};

function DynamicFilter() {
  const [taskDetails, setTaskDetails] = useState([]);
  const [filterGroup, setFilterGroup] = useState([]);

  const context = useContext(FilterContext);

  const {
    handleFilter: { setDetails },
  } = context;

  useEffect(() => {
    taskService.getDetails().then(({ data }) => {
      setTaskDetails(data);
      setDetails(data);
    });
  }, []);

  const keyComponentMap = useMemo(() => {
    return taskDetails.reduce((acc, item) => {
      acc[item.key] = item;
      return acc;
    }, {});
  }, [taskDetails]);

  const addFilterGroup = () => {
    if (filterGroup.length == taskDetails.length) return;

    const group = {
      selectedType: "none",
      value: "",
    };

    const res = [...filterGroup, group];

    setFilterGroup(res);
  };

  const typeExists = (type) => {
    return filterGroup.find((a) => a.selectedType === type);
  };

  const changeFilterGroupType = (e, item) => {
    const exists = typeExists(e.target.value);
    if (exists) return;

    const index = filterGroup.findIndex((a) => a == item);

    const dup = filterGroup.slice().map((a) => ({ ...a }));

    dup[index].selectedType = e.target.value;
    dup[index].componentType = e.target.value;

    setFilterGroup(dup);
  };

  const changeFilterGroupValue = (e, item) => {
    const index = filterGroup.findIndex((a) => a == item);
    const dup = filterGroup.slice().map((a) => ({ ...a }));

    const val = e?.target?.value ?? e;

    dup[index].value = val;

    setFilterGroup(dup);
  };

  const deleteFilterGroup = (item) => {
    const clone = filterGroup.filter((a) => a != item);

    setFilterGroup(clone);
  };

  const createValueComponent = (item) => {
    const details = keyComponentMap[item.selectedType];
    const inputType = details ? details.input_type : "none";

    switch (inputType) {
      case "enum":
        return (
          <Select
            value={item.value}
            onChange={(e) => changeFilterGroupValue(e, item)}
            sx={width2}
            displayEmpty
          >
            <MenuItem value="">None</MenuItem>
            {details.enum.map((a, idx) => (
              <MenuItem key={idx} value={a}>
                {a}
              </MenuItem>
            ))}
          </Select>
        );
      case "string":
      case "text":
        return (
          <TextField
            placeholder={details.label}
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
            placeholder={details.label}
            value={item.value}
            type="number"
            onChange={(e) => changeFilterGroupValue(e, item)}
            sx={width2}
          />
        );
      default:
        return (
          <Select displayEmpty sx={width2}>
            <MenuItem>None</MenuItem>
          </Select>
        );
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
          Add filter
        </Button>
      </Grid>

      {filterGroup.map((item, index) => {
        const { selectedType: type, value } = item;

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
                <MenuItem value="none">None</MenuItem>
                {taskDetails.map((c) => (
                  <MenuItem
                    key={c.key}
                    value={c.key}
                    disabled={typeExists(c.key)}
                  >
                    {c.label}
                  </MenuItem>
                ))}
              </Select>
              {valueComponent}
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default DynamicFilter;
