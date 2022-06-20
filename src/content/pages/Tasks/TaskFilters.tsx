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
    handleFilter: { filter, setFilter },
  } = context;

  return (
    <Grid container spacing={2}>
      {filters.map((c) => (
        <Grid item key={c.value}>
          <Button
            variant={filter == c.value ? "contained" : "text"}
            onClick={() => setFilter(c.value)}
          >
            {c.label}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}

export default TaskFilter;
