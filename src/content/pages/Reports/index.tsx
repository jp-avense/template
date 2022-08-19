import { Box, Container, Grid, TablePagination, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { parseAgentResponse } from "src/contexts/AgentContext";
import { getAxiosErrorMessage } from "src/lib";
import { agentService } from "src/services/agent.service";
import { taskService } from "src/services/task.service";
import Swal from "sweetalert2";
import ReportsHeader from "./ReportsHeader";
import ReportsTable from "./ReportsTable";
import ReportsGrid from "./ReportsGrid";
import { historyService } from "src/services/history.service";
import axios from "axios";

const applyPagination = (forms: any, page: number, limit: number) => {
  return forms.slice(page * limit, page * limit + limit);
};

function ReportsPage() {
  const [status, setStatus] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const [value, setValue] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [history, setHistory] = useState([]);
  let cancelToken;
  const {
    t,
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    cancelToken = axios.CancelToken.source();
    init();

    return () => {
      if (cancelToken) {
        cancelToken.cancel("Operations cancelled");
      }
    };
  }, []);

  const init = async () => {
    try {
      setLoading(true);

      console.log("mounted");
      const [taskData, agentData, historyData] = await Promise.all([
        taskService.getAll({}, cancelToken),
        agentService.getAgents(cancelToken),
        historyService.getAllHistory(cancelToken),
      ]);

      setStatus(taskData.data.tasks);
      setFilteredData(taskData.data.tasks);
      setHistory(historyData.data);
      const res = parseAgentResponse(agentData.data);

      setAgents(res);
    } catch (error) {
      if (error?.message === "Operations cancelled") {
        console.log(error.message);
      } else {
        Swal.fire({
          icon: "error",
          text: getAxiosErrorMessage(error),
          timer: 4000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: any): void => {
    setLimit(parseInt(event.target.value));
    setPage(0);
  };

  const paginatedForms = applyPagination(filteredData, page, limit);

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

  console.log(history);

  return (
    <>
      <Helmet>
        <title>{t("dashboard")}</title>
      </Helmet>
      <Container maxWidth="lg">
        <Grid container>
          <Grid item xs={12} lg={12} mt={5}>
            <ReportsHeader
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
        <Grid>
          <ReportsGrid
            countNewStatus={countNewStatus}
            countUndone={countUndone}
            countDone={countDone}
            countProgress={countProgress}
            loading={loading}
          />
        </Grid>
        <Paper>
          <Grid sx={{ mt: 2 }} item xs={12} lg={6}>
            <ReportsTable
              filteredData={paginatedForms}
              history={history}
              countNewStatus={countNewStatus}
              countUndone={countUndone}
              countDone={countDone}
              countProgress={countProgress}
              loading={loading}
            />
          </Grid>
          <Box p={2}>
            <TablePagination
              component="div"
              count={filteredData.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 25, 30]}
              labelRowsPerPage={t("rowsPerPage")}
            />
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default ReportsPage;
