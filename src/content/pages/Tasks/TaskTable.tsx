import { FC } from "react";
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

interface TaskTableProps {
  className?: string;
  tasks: any[];
}

const TaskTable: FC<TaskTableProps> = ({ tasks }) => {
  console.log(tasks);
  return (
    <Card>
      <CardHeader title="Tasks" />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task ID</TableCell>
              <TableCell>Task Type</TableCell>
              <TableCell>Agent</TableCell>
              <TableCell>Assigned at</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>123456</TableCell>
              <TableCell>Inspection</TableCell>
              <TableCell>John Lopez</TableCell>
              <TableCell>June 1, 2022</TableCell>
              <TableCell>Done</TableCell>
            </TableRow>
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
