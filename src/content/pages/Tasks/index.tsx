import { Container, Grid } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import TaskHeader from "./TaskHeader";
import TaskTable from "./TaskTable";

const TaskPage = () => {
  return (
    <>
      <Helmet>
        <title>Task management - Tasks</title>
      </Helmet>
      <PageTitleWrapper>
        <TaskHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <TaskTable tasks={[]} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default TaskPage;
