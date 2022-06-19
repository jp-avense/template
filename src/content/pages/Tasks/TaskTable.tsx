import { FC, useEffect, useState } from "react";
import PropTypes from "prop-types";

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
  CardContent,
  Box,
  CircularProgress,
  Checkbox,
  TablePagination,
} from "@mui/material";
import { TableRowsTwoTone } from "@mui/icons-material";
import Label from "src/components/Label";
import { TaskStatus } from "src/models/tasks";
import { useContext } from "react";

import { FilterContext } from "src/contexts/FilterContext";
import { TabsContext } from "src/contexts/TabsContext";
import TaskFilter from "./TaskFilters";
import { handleAxiosError } from "src/lib";
import { taskService } from "src/services/task.service";
import { values } from "lodash";

interface TaskTableProps {
  className?: string;
  tasks: any[];
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

const TaskTable: FC<TaskTableProps> = ({ tasks }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const filterContext = useContext(FilterContext);
  const tabsContext = useContext(TabsContext);
  const [selectedRow, setSelectedRow] = useState({});
  const {
    handleFilter: { filteredData, setOriginalData, originalData },
  } = filterContext;

  const {
    handleTabs: { setTabsData },
  } = tabsContext;

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);

  const jsonData = require("./response (2).json");

  useEffect(() => {
    setOriginalData(jsonData);
    createRows(jsonData);
    setLoading(false);
  }, [originalData]);

  useEffect(() => {
    setTabsData(selectedRow);
  }, [selectedRow]);

  // useEffect(() => {
  //   setLoading(true);
  //   taskService
  //     .getAll()
  //     .then(({ data }) => {
  //       setOriginalData(data);
  //       createRows(data);
  //     })
  //     .catch(handleAxiosError)
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    createRows(filteredData);
  }, [filteredData]);

  const getStatusLabel = (taskStatus: TaskStatus): JSX.Element => {
    const map = {
      new: {
        text: "New",
        color: "secondary",
      },
      done: {
        text: "Done",
        color: "success",
      },
      assigned: {
        text: "Assigned",
        color: "primary",
      },
      in_progress: {
        text: "Inprogress",
        color: "info",
      },
    };

    const { text, color }: any = map[taskStatus];

    return <Label color={color}>{text}</Label>;
  };

  const createRows = (data) => {
    console.log("dataaa", data);
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
      c.task_details.map((e) => {
        if (e.label == "Payment Date") {
          dynamicDetails.push({
            value: new Date(e.value).toDateString() || "",
            id: e.label,
            showInTable: e.show_in_table,
          });
        } else if (e.label == "Payment method" && e.value) {
          dynamicDetails.push({
            value: e.value.charAt(0).toUpperCase() + e.value.slice(1),
            id: e.label,
            showInTable: e.show_in_table,
          });
        } else
          dynamicDetails.push({
            value: e.value || "",
            id: e.label,
            showInTable: e.show_in_table,
          });
      });
      details.dynamicDetails = dynamicDetails;
      details.status = c.status_id;
      details.type = c.type_id.charAt(0).toUpperCase() + c.type_id.slice(1);
      details.createdAt = new Date(c.created_at).toDateString();
      details.assignedTo = c.assigned_to ? c.assigned_to.agent_name : "";
      details.lastUpdate = new Date(c.last_updated_at).toDateString();
      details.updatedBy = c.last_updated_by ? c.last_updated_by.user_name : "";
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

    originalData[0].task_details.map((c) => {
      if (c.show_in_table) headers.push({ id: c.label, label: c.label });
    });
    headers.push(
      { id: "assigned", label: "Assigned To" },
      { id: "status", label: "Status" },
      { id: "type", label: "Type" },
      { id: "createdAt", label: "Created" }
    );
    return headers;
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: any): void => {
    setLimit(parseInt(event.target.value));
  };

  const headers = headCells();
  console.log("selectedRow", selectedRow);

  return (
    <>
      <Card>
        <CardHeader title="Tasks" action={<TaskFilter />} />
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    // checked={selectedAllAgents}
                    // indeterminate={indeterminate}
                    // onChange={handleSelectAll}F
                  />
                </TableCell>
                {headers.map((c) => (
                  <TableCell key={c.id}>{c.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={headers.length + 1}
                    align="center"
                    height="200px"
                  >
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : (
                tableData.map((rows, index) => (
                  <TableRow
                    key={index}
                    sx={
                      rows == selectedRow
                        ? { backgroundColor: "aquamarine" }
                        : {}
                    }
                    onClick={() =>
                      rows == selectedRow
                        ? setSelectedRow({})
                        : setSelectedRow(rows)
                    }
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={rows == selectedRow ? true : false}
                        color="primary"
                      />
                    </TableCell>
                    {rows.dynamicDetails.map((dynamic) => (
                      <>
                        {dynamic.showInTable ? (
                          <TableCell key={dynamic.id}>
                            {dynamic.value}
                          </TableCell>
                        ) : (
                          <></>
                        )}
                      </>
                    ))}
                    <TableCell key={rows.id + rows.assignedTo}>
                      {rows.assignedTo}
                    </TableCell>
                    <TableCell key={rows.id + rows.status}>
                      {getStatusLabel(rows.status)}
                    </TableCell>
                    <TableCell key={rows.id + rows.type}>{rows.type}</TableCell>
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
            count={tableData.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25, 30]}
          />
        </Box>
      </Card>
    </>
  );
};

TaskTable.propTypes = {
  tasks: PropTypes.array.isRequired,
};

TaskTable.defaultProps = {
  tasks: [],
};

export default TaskTable;
