import { useContext } from "react";

import { FilterContext } from "src/contexts/FilterContext";
import { Button, Grid } from "@mui/material";
function TaskFilter() {
  const filters = [
    { label: "New", value: "new" },
    { label: "Assigned", value: "assigned" },
    { label: "Inprogress", value: "in_progress" },
    { label: "Done", value: "done" },
    { label: "Clear Filters", value: "clear_filters" },
  ];
  const context = useContext(FilterContext);
  const {
    handleFilter: { filterTable },
  } = context;

  return (
    <Grid container justifyContent="space-between" width="40%">
      {filters.map((c) => (
        <Button
          key={c.value}
          variant="contained"
          onClick={() => filterTable(c.value)}
        >
          {c.label}
        </Button>
      ))}
    </Grid>
  );
}

export default TaskFilter;
