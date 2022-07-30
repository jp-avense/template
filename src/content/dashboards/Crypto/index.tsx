import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import { Container, Grid, Box, CircularProgress, Paper } from "@mui/material";
import { taskService } from "src/services/task.service";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useTranslation } from "react-i18next";
import TaskHeader from "./Tasks/TaskHeader";
import TaskGrid from "./Tasks/TaskGrid";

function DashboardCrypto() {
  const [status, setStatus] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(null);

  const {
    t,
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    setLoading(true);
    taskService
      .getAll()
      .then(({ data }) => {
        setStatus(data.tasks);
        setFilteredData(data.tasks);
      })
      .finally(() => setLoading(false));
  }, []);

  const filterByMonth = (e) => {
    const d = new Date(e);
    const dateString = d.getMonth() + 1 + "/" + d.getFullYear();
    const getDates = status.filter((item) => {
      const date = item.createdAt;
      const x = new Date(date);
      const dateData = x.getMonth() + 1 + "/" + x.getFullYear();
      return dateData === dateString;
    });
    setValue(d);
    setFilteredData(getDates);
  };

  const newStatus = filteredData.filter((item) => item.statusId === "new");
  const countNewStatus = newStatus.length;

  const unDoneStatus = filteredData.filter((item) => item.statusId !== "done");
  const countUndone = unDoneStatus.length;

  const doneStatus = filteredData.filter((item) => item.statusId === "done");
  const countDone = doneStatus.length;

  const progressStatus = filteredData.filter(
    (item) => item.statusId === "inProgress"
  );
  const countProgress = progressStatus.length;

  const assignedTask = filteredData.filter((item) => item.assignedTo);
  const countAssignedTask = assignedTask.length;

  const resetData = () => {
    setFilteredData(status);
  };

  const chartOptions: ApexOptions = {
    chart: {
      background: "transparent",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
        },
      },
    },

    colors: ["#57CA22", "#5569ff", "#FFA319", "#5c6ac0"],
    labels: ["New", "Done", "In Progress", "Assigned"],
    stroke: {
      width: 0,
    },
  };

  const chartSeries = [
    countNewStatus,
    countDone,
    countProgress,
    countAssignedTask,
  ];

  console.log(filteredData);

  return (
    <>
      <Helmet>
        <title>{t("dashboard")}</title>
      </Helmet>
      <PageTitleWrapper></PageTitleWrapper>
      <Container maxWidth="lg">
        <TaskHeader
          filterByMonth={filterByMonth}
          resetData={resetData}
          value={value}
          status={status}
          loading={loading}
          setLoading={setLoading}
          setFilteredData={setFilteredData}
          filteredData={filteredData}
        />
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} lg={6}>
            <Paper>
              <Box p={3}>
                {loading ? (
                  <Box display="flex" justifyContent="center" py={11}>
                    <CircularProgress size={50} />
                  </Box>
                ) : (
                  <Chart
                    height={250}
                    options={chartOptions}
                    series={chartSeries}
                    type="pie"
                  />
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={6}>
            <TaskGrid
              countNewStatus={countNewStatus}
              countUndone={countUndone}
              countDone={countDone}
              countProgress={countProgress}
              loading={loading}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default DashboardCrypto;
