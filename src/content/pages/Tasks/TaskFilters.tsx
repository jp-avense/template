import { useContext, useEffect } from "react";

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
    handleFilter: {
      filter,
      setFilter,
      setLoading,
      loading,
      getDataAndSet,
      setDynamicFilters,
      dynamicFilters,
    },
  } = context;

  useEffect(() => {
    if (filter === "clear_filters" && dynamicFilters.length === 0) {
      handleRefresh();
    }
  }, [dynamicFilters]);

  const handleRefresh = async () => {
    setLoading(true);

    await getDataAndSet({
      statusId: undefined,
    });
    setLoading(false);
  };

  const handleChange = async (value: string) => {
    setFilter(value);

    setLoading(true);
    if (value === "clear_filters" && dynamicFilters.length > 0) {
      setDynamicFilters([]);
    } else
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
