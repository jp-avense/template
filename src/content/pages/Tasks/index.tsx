import { Box, Container, Grid } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import TaskHeader from "./TaskHeader";
import TaskTable from "./TaskTable";
import TaskFilter from "./TaskFilters";
import DynamicFilter from "./DynamicFilters";
import { FilterProvider } from "src/contexts/FilterContext";
import { TabsProvider } from "src/contexts/TabsContext";
import InfoTab from "./InfoTab";

const TaskPage = () => {
  return (
    <>
      <Helmet>
        <title>Task management - Tasks</title>
      </Helmet>
      <PageTitleWrapper>
        <TaskHeader />
      </PageTitleWrapper>

      <Container maxWidth="xl">
        <Grid container direction="row" alignItems="stretch" spacing={3}>
          <FilterProvider>
            <TabsProvider>
              <Grid item xs={8}>
                <TaskTable tasks={[]} />
              </Grid>
              <Grid item xs={4}>
                <InfoTab />
              </Grid>
            </TabsProvider>
          </FilterProvider>
        </Grid>
      </Container>
    </>
  );
};

export default TaskPage;
