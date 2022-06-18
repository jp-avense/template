import { useContext, useState, useEffect } from "react";

import { FilterContext } from "src/contexts/FilterContext";
import {
  Button,
  Grid,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  TextField,
} from "@mui/material";

import { DatePicker } from "@mui/lab";

function DynamicFilter() {
  let currentTime = new Date();
  const [filterVal, setFilterValue] = useState("none");
  const [currentFilter, setCurrentFilter] = useState(<></>);
  const [selectedDate, setSelectedDate] = useState(currentTime);
  const [type, setSelectedType] = useState("debt");
  const [details, setDetails] = useState({});

  const context = useContext(FilterContext);
  const {
    handleFilter: { filterDynamicTable },
  } = context;

  const filters = [
    { label: "None", value: "none" },
    { label: "Type", value: "type_id" },
    { label: "Created at", value: "created_at" },
    { label: "Assigned to", value: "assigned_to" },
  ];

  const types = [
    { label: "Debt", value: "debt" },
    { label: "Paid", value: "paid" },
    { label: "Pending", value: "pending" },
  ];

  const handleChange = (event) => {
    setFilterValue(event.target.value);
    showFilter(filterVal);
  };

  const handleDateChange = (date) => {
    setSelectedDate(() => {
      return date;
    });
  };

  const handleTypeChange = (event) => {
    setSelectedType(() => {
      return event.target.value;
    });
    showFilter(filterVal);
  };

  const showFilter = (value) => {
    switch (value) {
      case "none":
        return setCurrentFilter(<></>);
      case "type_id":
        return setCurrentFilter(
          <Select value={type} onChange={handleTypeChange}>
            {types.map((c) => (
              <MenuItem key={c.value} value={c.value}>
                {c.label}
              </MenuItem>
            ))}
          </Select>
        );
      case "created_at":
        return setCurrentFilter(
          <DatePicker
            value={selectedDate}
            onChange={(newValue) => {
              handleDateChange(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        );
      case "assigned_to":
        return setCurrentFilter(
          <TextField id="outlined-basic" variant="outlined" />
        );
    }
  };

  useEffect(() => {
    showFilter(filterVal);
    setDetails(() => {
      if (filterVal == "type_id") {
        return { filter: filterVal, value: type };
      } else if (filterVal == "created_at") {
        return { filter: filterVal, value: selectedDate };
      }
    });
  }, [filterVal, type, selectedDate]);
  return (
    <>
      <span>Dynamic Filter</span>
      <Select
        sx={{ ml: "10px", mr: "10px" }}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={filterVal}
        onChange={handleChange}
      >
        {filters.map((c) => (
          <MenuItem key={c.value} value={c.value}>
            {c.label}
          </MenuItem>
        ))}
      </Select>
      {currentFilter}
      {filterVal != "none" ? (
        <Button
          onClick={() => filterDynamicTable(details)}
          sx={{ ml: "10px" }}
          variant="contained"
        >
          Filter
        </Button>
      ) : (
        <></>
      )}
    </>
  );
}

export default DynamicFilter;
