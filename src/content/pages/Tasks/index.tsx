import { Box, Card, CardContent, Container, Grid } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import TaskHeader from "./TaskHeader";
import TaskTable from "./TaskTable";
import TaskFilter from "./TaskFilters";
import DynamicFilter from "./DynamicFilters";
import { FilterProvider } from "src/contexts/FilterContext";

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

        <Container maxWidth="lg">
          <Grid
            container
            direction="column"
            alignItems="stretch"
            justifyItems="stretch"
            spacing={3}
          >
            <Grid item>
              <Card>
                <CardContent>
                  <Box>
                    <DynamicFilter />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <TaskTable />
            </Grid>
          </Grid>
        </Container>
      </FilterProvider>
    </>
  );
};

export default TaskPage;
