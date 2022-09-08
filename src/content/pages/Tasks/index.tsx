import { Container, Grid, Paper } from "@mui/material";
import { useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import TaskHeader from "./TaskHeader";
import TaskTable from "./TaskTable";
import DynamicFilter from "./DynamicFilters";
import { FilterContext, FilterProvider } from "src/contexts/FilterContext";
import { TabsProvider } from "src/contexts/TabsContext";
import InfoTab from "./InfoTab";
import { taskService } from "src/services/task.service";
import { AgentContext } from "src/contexts/AgentContext";
import { useTranslation } from "react-i18next";
import { settingsService } from "src/services/settings.service";
import { formService } from "src/services/form.service";

const TaskPage = () => {
  const context = useContext(FilterContext);
  const agentctx = useContext(AgentContext);

  const { t } = useTranslation();

  const {
    handleFilter: {
      getDataByFilters,
      setOriginalData,
      setDetails,
      setStatus,
      setTypes,
      setTotal,
      setLoading,
      setSettings,
      setForms,
    },
  } = context;

  const {
    handleAgents: { getAgents },
  } = agentctx;

  useEffect(() => {
    setLoading(true);
    const promise = Promise.all([
      getDataByFilters(),
      taskService.getDetails(),
      taskService.getStatuses(),
      taskService.getTypes(),
      getAgents() as any,
      settingsService.getAll(),
      formService.getForms(),
    ]);

    promise
      .then((res) => {
        const [taskRes, details, statuses, types, agents, settings, forms] =
          res.map((item) => item.data);

        setOriginalData(taskRes.tasks);
        setDetails(details);

        statuses.sort((a, b) => a.label.localeCompare(b.label));
        setStatus(statuses);

        types.sort((a, b) => a.label.localeCompare(b.label));
        setTypes(types);
        setTotal(taskRes.totalDocuments);

        setSettings(settings);
        setForms(forms);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>{t("taskManagementTask")}</title>
      </Helmet>
      <TabsProvider>
        {/* <PageTitleWrapper>
        </PageTitleWrapper> */}
        <Container maxWidth="xl">
          <Grid container direction="row" alignItems="stretch" spacing={3}>
            {/* <Grid item xs={12} mt={3}>
              <TaskHeader />
            </Grid> */}
            <Grid item xs={12}>
              <Paper>
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  p={1}
                  mt={3}
                >
                  <Grid item xs={6}>
                    <DynamicFilter />
                  </Grid>
                  <Grid item xs={6}>
                    <TaskHeader />
                  </Grid>
                </Grid>
              </Paper>
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
