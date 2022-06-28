import { useContext } from "react";

import { FilterContext } from "src/contexts/FilterContext";
import { Button, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

function TaskFilter() {
  const { t } = useTranslation();
  const filters = [
    { label: "new", value: "new" },
    { label: "assigned", value: "assigned" },
    { label: "inprogress", value: "inProgress" },
    { label: "done", value: "done" },
    { label: "clearFilters", value: "clear_filters" },
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
            {t(c.label)}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}

export default TaskFilter;
