import { Box, Card, CardContent, Container, Grid } from "@mui/material";
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
      <FilterProvider>
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
            <TabsProvider>
              <Grid item xs={8}>
                <TaskTable />
              </Grid>
              <Grid item xs={4}>
                <InfoTab />
              </Grid>
            </TabsProvider>
          </Grid>
        </Container>
      </FilterProvider>
    </>
  );
};

export default TaskPage;
