import { AgentContext } from "src/contexts/AgentContext";
import { useContext } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useTranslation } from "react-i18next";

function AgentFilter() {
  const context = useContext(AgentContext);
  const { filter, setFilter } = context.handleAgents;
  const { t } = useTranslation();

  const filters = [
    { key: "none", value: t("none") },
    { key: "admin", value: t("admin") },
    { key: "backoffice", value: t("backOffice") },
    { key: "agent", value: t("agent") },
    { key: "manager", value: t("manager") },
    { key: "guest", value: t("guest") },
    { key: "1", value: t("enabled") },
    { key: "0", value: t("disabled") },
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
