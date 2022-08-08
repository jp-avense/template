import { AgentContext } from "src/contexts/AgentContext";
import { useContext } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
function AgentFilter() {
  const context = useContext(AgentContext);
  const { filter, setFilter } = context.handleAgents;

  const filters = [
    { key: "none", value: "None" },
    { key: "admin", value: "Admin" },
    { key: "backoffice", value: "BackOffice" },
    { key: "agent", value: "Agent" },
    { key: "manager", value: "Manager" },
    { key: "guest", value: "Guest" },
    { key: "1", value: "Enabled" },
    { key: "0", value: "Disabled" },
  ];

  const handleChange = (val) => {
    setFilter(val);
  };

  return (
    <>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Filter</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Filter"
          onChange={(e) => handleChange(e.target.value)}
          value={filter}
        >
          {filters.map((c) => {
            return (
              <MenuItem key={c.key} value={c.key}>
                {" "}
                {c.value}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </>
  );
}

export default AgentFilter;
