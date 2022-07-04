import { FC, useEffect, useState } from "react";

import {
  Divider,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Box,
  CircularProgress,
  Checkbox,
  TablePagination,
} from "@mui/material";
import { useContext } from "react";

import { FilterContext } from "src/contexts/FilterContext";
import { TabsContext } from "src/contexts/TabsContext";
import TaskFilter from "./TaskFilters";
import AssignTaskForm from "./AssignTaskForm";
import UpdateTaskForm from "./UpdateTaskForm";
import { useTranslation } from "react-i18next";
import useRoles from "src/hooks/useRole";
import swal from "sweetalert2";
import { getAxiosErrorMessage } from "src/lib";

interface Rows {
  dynamicDetails: any[];
  status: string;
  type: string;
  createdAt: string;
  id: string;
  assignedTo: string;
  lastUpdate: string;
  updatedBy: string;
  executionStartDate: string;
}

const TaskTable = () => {
  const [tableData, setTableData] = useState<Rows[]>([]);
  const filterContext = useContext(FilterContext);
  const tabsContext = useContext(TabsContext);
  const [headers, setHeaders] = useState([]);
  const roles = useRoles();

  const isAdmin = roles.includes("admin");

  const {
    handleFilter: {
      total,
      originalData,
      filter,
      page,
      setPage,
      limit,
      setLimit,
      loading,
      setLoading,
      selectedRows,
      setSelectedRows,
      getDataAndSet,
    },
  } = filterContext;

  const { t } = useTranslation();

  const {
    handleTabs: { setTabsData },
  } = tabsContext;

  useEffect(() => {
    createRows(originalData);
  }, [originalData]);

  useEffect(() => {
    const ceiling = Math.floor(total / limit);

    if (page > ceiling) {
      setPage(ceiling);
    }
  }, [originalData, total]);

  useEffect(() => {
    const res = tableData.filter((item) => selectedRows.includes(item.id));

    setTabsData(res);
  }, [tableData, selectedRows]);

  const unSelectRow = (currentRowId: string) => {
    const filtered = selectedRows.filter((item) => item !== currentRowId);
    setSelectedRows(filtered);
  };

  const createSelectedRows = (currentRowId: string) => {
    let rows = [...selectedRows, currentRowId];
    setSelectedRows(rows);
  };

  const selectAllRows = (e) => {
    if (e.target.checked) {
      const res = tableData.map((item) => item.id);
      setSelectedRows(res);
    } else setSelectedRows([]);
  };

  const createRows = (data) => {
    let rows = [];

    data.map((c) => {
      let dynamicDetails: any[] = [];
      let details: Rows = {
        dynamicDetails: [],
        status: "",
        type: "",
        createdAt: undefined,
        id: undefined,
        assignedTo: "",
        lastUpdate: "",
        updatedBy: "",
        executionStartDate: "",
      };
      c.taskDetails.map((e) => {
        if (e.inputType === "date" || e.inputType === "datetime") {
          dynamicDetails.push({
            ...e,
            value: e.value ? new Date(e.value).toLocaleDateString() : "",
            id: e.label,
            order: e.order,
          });
        } else
          dynamicDetails.push({
            ...e,
            value: e.value || "",
            id: e.label,
            order: e.order,
          });
      });
      dynamicDetails.sort((a, b) => a.order - b.order);
      details.dynamicDetails = dynamicDetails;
      details.status = c.statusId;

      details.type = c.taskType;
      details.createdAt = new Date(c.createdAt).toDateString();
      details.assignedTo = c.assignedTo ? c.assignedTo.agentName : "";
      details.lastUpdate = new Date(c.lastUpdatedAt).toDateString();
      details.updatedBy = c.lastUpdatedBy ? c.lastUpdatedBy.userName : "";
      details.executionStartDate = c.executionStartDate;
      details.id = c._id;
      rows.push(details);
    });

    setTableData(() => {
      return rows;
    });
  };

  const headCells = () => {
    let headers = [];

    if (!originalData.length) return headers;

    originalData[0].taskDetails.map((c) => {
      if (c.showInTable)
        headers.push({ id: c.label, label: c.label, order: c.order });
    });
    headers.sort((a, b) => a.order - b.order);
    return headers;
  };

  const handlePageChange = async (e: any, newPage: number) => {
    if (loading) return;
    try {
      setLoading(true);
      setPage(newPage);

      await getDataAndSet({
        page: newPage,
      });
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      swal.fire({
        icon: "error",
        title: "Error",
        text: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLimitChange = async (e: any) => {
    if (loading) return;

    try {
      setLoading(true);
      setPage(0);
      setLimit(parseInt(e.target.value));

      await getDataAndSet({
        limit: e.target.value,
      });
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      swal.fire({
        icon: "error",
        title: "Error",
        text: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const temp = headCells();
    if (temp.length != 0) setHeaders(temp);
  }, [originalData]);

  return (
    <Card>
      <Box
        alignItems="center"
        justifyContent="space-between"
        display="flex"
        p={2}
      >
        <Box fontWeight="bold" display="flex" gap={3} alignItems="center">
          <Box>{t("task")}</Box>
          {selectedRows.length > 0 && isAdmin ? (
            <Box>
              <AssignTaskForm selected={selectedRows}></AssignTaskForm>
            </Box>
          ) : null}
          {selectedRows.length == 1 && isAdmin ? (
            <Box>
              <UpdateTaskForm selected={selectedRows[0]}></UpdateTaskForm>
            </Box>
          ) : null}
        </Box>
        <Box>
          <TaskFilter />
        </Box>
      </Box>
      <Divider />
      <TableContainer sx={{ height: "550px" }}>
        <Table stickyHeader sx={{ height: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedRows.length == tableData.length}
                  indeterminate={
                    selectedRows.length !== tableData.length &&
                    selectedRows.length > 0
                  }
                  onClick={selectAllRows}
                  color="primary"
                />
              </TableCell>
              {headers.length
                ? headers.map((c) => (
                    <TableCell key={c.id}>{t(c.label)}</TableCell>
                  ))
                : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={headers.length + 1} align="center">
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : tableData.length == 0 ? (
              <TableRow>
                <TableCell colSpan={headers.length + 1} align="center">
                  {t("noDataAvailable")}
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((rows, index) => (
                <TableRow
                  key={index}
                  sx={[
                    {
                      "&:hover": {
                        cursor: "pointer",
                        backgroundColor: "aliceblue",
                      },
                    },
                    selectedRows.indexOf(rows.id) >= 0
                      ? { backgroundColor: "lavender" }
                      : {},
                  ]}
                  onClick={() =>
                    selectedRows.indexOf(rows.id) >= 0
                      ? unSelectRow(rows.id)
                      : createSelectedRows(rows.id)
                  }
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={
                        selectedRows.indexOf(rows.id) >= 0 ? true : false
                      }
                      color="primary"
                    />
                  </TableCell>

                  {rows.dynamicDetails.map((dynamic) => {
                    if (dynamic.showInTable) {
                      let value = dynamic.value;
                      let id = dynamic.id;

                      if (typeof value === "object") {
                        id = value.id;
                        value = value.value;
                      }

                      return <TableCell key={id}>{value}</TableCell>;
                    } else return null;
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={total}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
          labelRowsPerPage={t("rowsPerPage")}
        />
      </Box>
    </Card>
  );
};

export default TaskTable;
