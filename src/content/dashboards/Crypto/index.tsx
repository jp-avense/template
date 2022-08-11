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
import { agentService } from "src/services/agent.service";
import { parseAgentResponse } from "src/contexts/AgentContext";
import { getAxiosErrorMessage } from "src/lib";
import Swal from "sweetalert2";

function DashboardCrypto() {
  const [status, setStatus] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");

  const {
    t,
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      setLoading(true);

      const [taskData, agentData] = await Promise.all([
        taskService.getAll(),
        agentService.getAgents(),
      ]);

      setStatus(taskData.data.tasks);
      setFilteredData(taskData.data.tasks);

      const res = parseAgentResponse(agentData.data);

      setAgents(res);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: getAxiosErrorMessage(error),
        timer: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const filterByMonth = (e) => {
    const d = new Date(e);
    const dateString = d.getMonth() + 1 + "/" + d.getFullYear();
    const getDates = status.filter((item) => {
      const date = item.createdAt;
      const x = new Date(date);
      const dateData = x.getMonth() + 1 + "/" + x.getFullYear();
      return dateData === dateString;
    });
    setSelectedAgent("");
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

  const assignedTo = filteredData.filter(
    (item) => item.statusId === "assigned"
  );
  const countAssignedTo = assignedTo.length;

  const resetData = () => {
    setFilteredData(status);
    setValue(null);
  };

  const chartOptions: ApexOptions = {
    chart: {
      background: "transparent",
      stacked: false,
      toolbar: {
        show: true,
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
    countAssignedTo,
  ];

  const x = status.reduce((acc, cur) => {
    acc[cur.assignedTo.agentSub] = acc[cur.assignedTo.agentSub] || {
      agentName: cur.assignedTo.agentName,
      new: 0,
      inProgress: 0,
      done: 0,
      unDone: 0,
      xAssign: 0,
      total: 0,
    };

    if (cur.statusId === "new") {
      acc[cur.assignedTo.agentSub].new += (acc[cur.statusId] || 0) + 1;
    }

    if (cur.statusId === "inProgress") {
      acc[cur.assignedTo.agentSub].inProgress += (acc[cur.statusId] || 0) + 1;
    }

    if (cur.statusId === "done") {
      acc[cur.assignedTo.agentSub].done += (acc[cur.statusId] || 0) + 1;
    }

    if (cur.statusId === "assigned") {
      acc[cur.assignedTo.agentSub].xAssign += (acc[cur.statusId] || 0) + 1;
    }

    if (cur.statusId !== "done") {
      acc[cur.assignedTo.agentSub].unDone += (acc[cur.statusId] || 0) + 1;
    }

    acc[cur.assignedTo.agentSub].total =
      acc[cur.assignedTo.agentSub].new +
      acc[cur.assignedTo.agentSub].inProgress +
      acc[cur.assignedTo.agentSub].done +
      acc[cur.assignedTo.agentSub].xAssign +
      acc[cur.assignedTo.agentSub].unDone;

    return acc;
  }, {});

  const d = Object.values(x).map((item: any) => ({
    agentHeads: item.agentName,
    new: item.new,
    inProgress: item.inProgress,
    done: item.done,
    unDone: item.unDone,
    assi: item.xAssign,
    total: item.total,
  }));

  const filteredHasValue = d.filter((item) => {
    return item.agentHeads !== undefined;
  });

  const p = filteredHasValue.map((item) => {
    return item;
  });

  const topTen = p.slice(0, 10);
  topTen.sort((a, b) => b.total - a.total);

  const barOptions: ApexOptions = {
    chart: {
      background: "transparent",
      toolbar: {
        show: true,
      },
      stacked: true,
    },
    tooltip: {
      followCursor: true,
    },
    xaxis: {
      categories: topTen.map((item) => {
        return item.agentHeads;
      }),
    },
  };

  const barGraphData = [
    {
      name: "New",
      data: topTen.map((item) => {
        return item.new;
      }),
      color: "#57CA22",
    },
    {
      name: "Assigned",
      data: topTen.map((item) => {
        return item.assi;
      }),
      color: "#5C6AC0",
    },
    {
      name: "Done",
      data: topTen.map((item) => {
        return item.done;
      }),
      color: "#5569ff",
    },
    {
      name: "In Progress",
      data: topTen.map((item) => {
        return item.inProgress;
      }),
      color: "#FFA319",
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t("dashboard")}</title>
      </Helmet>
      <Container maxWidth="lg">
        <Grid container>
          <Grid item xs={12} lg={12} mt={5}>
            <TaskHeader
              filterByMonth={filterByMonth}
              resetData={resetData}
              value={value}
              status={status}
              loading={loading}
              agents={agents}
              setFilteredData={setFilteredData}
              selectedAgent={selectedAgent}
              setSelectedAgent={setSelectedAgent}
              setValue={setValue}
            />
          </Grid>
        </Grid>
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
        <Grid container mt={3}>
          <Grid item xs={12} lg={12} mb={4}>
            <Paper>
              <Box py={3}>
                <Chart
                  type="bar"
                  fullWidth
                  height={400}
                  series={barGraphData}
                  options={barOptions}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default DashboardCrypto;
