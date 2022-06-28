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
  CardHeader,
  Box,
  CircularProgress,
  Checkbox,
  TablePagination,
  Button,
} from "@mui/material";
import Label from "src/components/Label";
import { TaskStatus, TaskStatusEnum } from "src/models/tasks";
import { useContext } from "react";

import { FilterContext } from "src/contexts/FilterContext";
import { TabsContext } from "src/contexts/TabsContext";
import TaskFilter from "./TaskFilters";
import { handleAxiosError } from "src/lib";
import AssignTaskForm from "./AssignTaskForm";
import { useTranslation } from "react-i18next";

interface TaskTableProps {
  className?: string;
}

// TODO just a dummy here
const mapping = {
  1: "Registration",
  2: "Acting",
};

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

const TaskTable: FC<TaskTableProps> = () => {
  const [tableData, setTableData] = useState<Rows[]>([]);
  const filterContext = useContext(FilterContext);
  const tabsContext = useContext(TabsContext);
  const [headers, setHeaders] = useState([]);
  const {
    handleFilter: {
      total,
      setTotal,
      setOriginalData,
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
    },
  } = filterContext;

  const { t } = useTranslation();

  const {
    handleTabs: { setTabsData },
  } = tabsContext;

  const {
    handleFilter: { getDataByFilters },
  } = filterContext;

  // const jsonData = require("./trueresponse.json");

  // useEffect(() => {
  //   setOriginalData(jsonData);
  //   createRows(jsonData);
  //   setLoading(false);
  // }, [originalData]);

  useEffect(() => {
    setLoading(true);
    setSelectedRows([]);

    getDataByFilters()
      .then(({ data }) => {
        setTotal(data.totalDocuments);
        setOriginalData(data.tasks);
        createRows(data.tasks);
      })
      .catch(handleAxiosError)
      .finally(() => {
        setLoading(false);
      });
  }, [page, limit, filter]);

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

  const getStatusLabel = (taskStatus: TaskStatus): JSX.Element => {
    const map = {
      new: {
        text: "new",
        color: "secondary",
      },
      done: {
        text: "done",
        color: "success",
      },
      assigned: {
        text: "assigned",
        color: "primary",
      },
      inProgress: {
        text: "inprogress",
        color: "info",
      },
    };

    const { text, color }: any = map[taskStatus];

    return <Label color={color}>{t(text)}</Label>;
  };

  const unSelectRow = (currentRowId: string) => {
    const filtered = selectedRows.filter((item) => item !== currentRowId);
    console.log(filtered);
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
        if (e.inputType === "date") {
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

      const type = mapping[c.taskType];

      // details.type = c.taskType.charAt(0).toUpperCase() + type.slice(1);
      details.type = type;
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
    headers.push({ id: "createdAt", label: "created" });
    headers.unshift(
      {
        id: "status",
        label: "status",
      },
      { id: "type", label: "type" },
      { id: "agent", label: "agent" }
    );
    return headers;
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: any): void => {
    setPage(0);
    setLimit(parseInt(event.target.value));
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
          {selectedRows.length == 1 ? (
            <Box>
              <AssignTaskForm selected={selectedRows[0]}></AssignTaskForm>
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
                  <TableCell>
                    {getStatusLabel(rows.status as TaskStatus)}
                  </TableCell>
                  <TableCell>{rows.type}</TableCell>
                  <TableCell>{rows.assignedTo}</TableCell>

                  {rows.dynamicDetails.map((dynamic) => {
                    if (dynamic.showInTable)
                      return (
                        <TableCell key={dynamic.id}>{dynamic.value}</TableCell>
                      );
                    else return null;
                  })}

                  <TableCell>{rows.createdAt}</TableCell>
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
