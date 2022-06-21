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
} from "@mui/material";
import Label from "src/components/Label";
import { TaskStatus, TaskStatusEnum } from "src/models/tasks";
import { useContext } from "react";

import { FilterContext } from "src/contexts/FilterContext";
import { TabsContext } from "src/contexts/TabsContext";
import TaskFilter from "./TaskFilters";
import { handleAxiosError } from "src/lib";
interface TaskTableProps {
  className?: string;
}

// TODO just a dummy here
const mapping = {
  1: 'Registration',
  2: 'Acting',
}


interface Rows {
  dynamicDetails: any[];
  status: string;
  type: string;
  createdAt: string;
  id: number;
  assignedTo: string;
  lastUpdate: string;
  updatedBy: string;
}


const TaskTable: FC<TaskTableProps> = () => {
  const [tableData, setTableData] = useState([]);
  const filterContext = useContext(FilterContext);
  const tabsContext = useContext(TabsContext);
  const [selectedRow, setSelectedRow] = useState([]);
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
    },
  } = filterContext;

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

  const getStatusLabel = (taskStatus: TaskStatus): JSX.Element => {
    const map = {
      "new": {
        text: "New",
        color: "secondary",
      },
      "done": {
        text: "Done",
        color: "success",
      },
      "assigned": {
        text: "Assigned",
        color: "primary",
      },
      "inProgress": {
        text: "In progress",
        color: "info",
      },
    };

    const { text, color }: any = map[taskStatus];

    return <Label color={color}>{text}</Label>;
  };

  useEffect(() => {
    setTabsData(selectedRow);
  }, [selectedRow]);

  const unSelectRow = (currentRow) => {
    let rows = selectedRow.slice();
    const index = rows.indexOf(currentRow);
    rows.splice(index, 1);
    setSelectedRow(rows);
  };

  const createSelectedRows = (currentRow) => {
    let rows = selectedRow.slice();
    rows.push(currentRow);
    setSelectedRow(rows);
  };

  const selectAllRows = () => {
    if (selectedRow == tableData) {
      setSelectedRow([]);
    } else setSelectedRow(tableData);
  };

  const createRows = (data) => {
    let rows = [];

    data.map((c) => {
      let id = 0;
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
      };
      c.taskDetails.map((e) => {
        let dynamicId = 1;

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

        dynamicId++;
      });
      dynamicDetails.sort((a, b) => a.order - b.order);
      details.dynamicDetails = dynamicDetails;
      details.status = c.statusId;
      
      const type = mapping[c.taskType]

      // details.type = c.taskType.charAt(0).toUpperCase() + type.slice(1);
      details.type = type
      details.createdAt = new Date(c.createdAt).toDateString();
      details.assignedTo = c.assignedTo ? c.assignedTo.agentName : "";
      details.lastUpdate = new Date(c.lastUpdatedAt).toDateString();
      details.updatedBy = c.lastUpdatedBy ? c.lastUpdatedBy.userName : "";
      details.id = id;
      id++;
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
    headers.push(
      { id: "status", label: "Status" },
      { id: "createdAt", label: "Created" }
    );
    headers.unshift({ id: "type", label: "Type" });
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
      <CardHeader title="Tasks" action={<TaskFilter />} />
      <Divider />
      <TableContainer sx={{ height: "550px" }}>
        <Table stickyHeader sx={{ height: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedRow == tableData}
                  indeterminate={
                    selectedRow != tableData && selectedRow.length > 0
                  }
                  onClick={selectAllRows}
                  color="primary"
                />
              </TableCell>
              {headers.length
                ? headers.map((c) => (
                    <TableCell key={c.id}>{c.label}</TableCell>
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
                  No data available
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
                    selectedRow.indexOf(rows) >= 0
                      ? { backgroundColor: "lavender" }
                      : {},
                  ]}
                  onClick={() =>
                    selectedRow.indexOf(rows) >= 0
                      ? unSelectRow(rows)
                      : createSelectedRows(rows)
                  }
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRow.indexOf(rows) >= 0 ? true : false}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell key={rows.id + rows.type}>{rows.type}</TableCell>
                  {rows.dynamicDetails.map((dynamic) => {
                    if (dynamic.showInTable)
                      return (
                        <TableCell key={dynamic.id}>{dynamic.value}</TableCell>
                      );
                    else return null;
                  })}
                  <TableCell key={rows.id + rows.status}>
                    {getStatusLabel(rows.status)}
                  </TableCell>
                  <TableCell key={rows.id + rows.createdAt}>
                    {rows.createdAt}
                  </TableCell>
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
        />
      </Box>
    </Card>
  );
};

export default TaskTable;
