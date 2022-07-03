import { Box, Card, CardContent, Container, Grid } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import TaskHeader from "./TaskHeader";
import TaskTable from "./TaskTable";
import DynamicFilter from "./DynamicFilters";
import { FilterContext, FilterProvider } from "src/contexts/FilterContext";
import { TabsProvider } from "src/contexts/TabsContext";
import InfoTab from "./InfoTab";
import { taskService } from "src/services/task.service";

const TaskPage = () => {
  const context = useContext(FilterContext);

  const {
    handleFilter: {
      getDataByFilters,
      setOriginalData,
      setDetails,
      setStatus,
      setTypes,
      setTotal,
      setLoading,
    },
  } = context;

  useEffect(() => {
    setLoading(true);
    const promise = Promise.all([
      getDataByFilters(),
      taskService.getDetails(),
      taskService.getStatuses(),
      taskService.getTypes(),
    ]);

    promise
      .then((res) => {
        const [taskRes, details, statuses, types] = res.map(
          (item) => item.data
        );

        setOriginalData(taskRes.tasks);
        setDetails(details);
        setStatus(statuses);
        setTypes(types);
        setTotal(taskRes.totalDocuments);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Task management - Tasks</title>
      </Helmet>
      <TabsProvider>
        <PageTitleWrapper>
          <TaskHeader />
        </PageTitleWrapper>
        <Container maxWidth="xl">
          <Grid container direction="row" alignItems="stretch" spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box>
                    <DynamicFilter />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={8}>
              <TaskTable />
            </Grid>
            <Grid item xs={4}>
              <InfoTab />
            </Grid>
          </Grid>
        </Container>
      </TabsProvider>
    </>
  );
};

export default () => (
  <FilterProvider>
    <TaskPage />
  </FilterProvider>
);
