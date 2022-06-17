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
} from "@mui/material";
import { TableRowsTwoTone } from "@mui/icons-material";
import Label from "src/components/Label";
import { TaskStatus } from "src/models/tasks";
import { useContext } from "react";

import { FilterContext } from "src/contexts/FilterContext";

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
}

const TaskTable: FC<TaskTableProps> = ({ tasks }) => {
  const [tableData, setTableData] = useState([]);
  const context = useContext(FilterContext);
  const {
    handleFilter: { filteredData, originalData, setOriginalData },
  } = context;
  const jsonData = require("./response (2).json");

  useEffect(() => {
    setOriginalData(jsonData);
    createRows(jsonData);
  }, [originalData]);

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
      };
      c.task_details.map((e) => {
        let dynamicId = 1;
        if (e.show_in_table) {
          if (e.label == "Payment Date") {
            dynamicDetails.push(new Date(e.value).toDateString() || "");
          } else dynamicDetails.push({ value: e.value || "", id: e.label });
        }
        dynamicId++;
      });
      details.dynamicDetails = dynamicDetails;
      details.status = c.status_id;
      details.type = c.type_id.charAt(0).toUpperCase() + c.type_id.slice(1);
      details.createdAt = new Date(c.created_at).toDateString();
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
    jsonData[0].task_details.map((c) => {
      if (c.show_in_table) headers.push({ id: c.label, label: c.label });
    });
    headers.push(
      { id: "status", label: "Status" },
      { id: "type", label: "Type" },
      { id: "createdAt", label: "Created" }
    );
    return headers;
  };

  return (
    <Card>
      <CardHeader title="Tasks" />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headCells().map((c) => (
                <TableCell key={c.id}>{c.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((rows, index) => (
              <TableRow key={index}>
                {rows.dynamicDetails.map((dynamic) => (
                  <TableCell key={dynamic.id}>{dynamic.value}</TableCell>
                ))}
                <TableCell key={rows.id + rows.status}>
                  {getStatusLabel(rows.status)}
                </TableCell>
                <TableCell key={rows.id + rows.type}>{rows.type}</TableCell>
                <TableCell key={rows.id + rows.createdAt}>
                  {rows.createdAt}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

TaskTable.propTypes = {
  tasks: PropTypes.array.isRequired,
};

TaskTable.defaultProps = {
  tasks: [],
};

export default TaskTable;
