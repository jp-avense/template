import { useContext } from "react";

import { FilterContext } from "src/contexts/FilterContext";
import { Button, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { taskService } from "src/services/task.service";

function TaskFilter() {
  const { t } = useTranslation();
  const filters = [
    { label: "new", value: "new" },
    { label: "assigned", value: "assigned" },
    { label: "inProgress", value: "inProgress" },
    { label: "done", value: "done" },
    { label: "clearFilters", value: "clear_filters" },
  ];
  const context = useContext(FilterContext);
  const {
    handleFilter: { filter, setFilter, setLoading, loading, getDataAndSet },
  } = context;

  const handleChange = async (value: string) => {
    setFilter(value);

    setLoading(true);
    await getDataAndSet({
      statusId: value === "clear_filters" ? undefined : value,
    });
    setLoading(false);
  };

  return (
    <Grid container spacing={2}>
      {filters.map((c) => (
        <Grid item key={c.value}>
          <Button
            variant={filter == c.value ? "contained" : "text"}
            disabled={loading}
            onClick={() => handleChange(c.value)}
          >
            {t(c.label)}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}

export default TaskFilter;
