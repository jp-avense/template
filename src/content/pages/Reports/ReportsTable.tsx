import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Paper,
} from "@mui/material";
import { t } from "i18next";
import moment from "moment";
import { historyService } from "src/services/history.service";
import { useEffect, useState } from "react";
import { reverse } from "lodash";

type Props = {
  countNewStatus: any;
  countUndone: any;
  countDone: any;
  countProgress: any;
  loading: boolean;
  filteredData: any;
  history: any;
};

function ReportsTable({
  countNewStatus,
  countUndone,
  countDone,
  countProgress,
  loading,
  filteredData,
  history,
}: Props) {
  const type = ["new", "done", "inProgress", "assigned"];
  const headCells = [
    "Task ID",
    "Type",
    "Status",
    "assignedTo",
    "createdAt",
    "Assigned Date",
    "Start Date",
    "Finished Date",
  ];

  const displayValue = (val) => {
    const created = val.createdAt
      ? moment(val.createdAt).format("DD/MM/YYYY")
      : "";
    const executionStart = val.executionStartDate
      ? moment(val.createdAt).format("DD/MM/YYYY")
      : "";

    const taskHistory = history.filter((c) => val._id === c.taskObjectId);
    let assignedDate = "";
    let startDate = "";
    let finishedDate = "";
    if (taskHistory.length > 0) {
      taskHistory.map((e) => {
        if (e.requestDto?.statusId === "assigned") {
          assignedDate = moment(e.updatedAt).format("DD/MM/YYYY");
        } else if (e.requestDto?.newStatusId === "inProgress")
          startDate = moment(e.updatedAt).format("DD/MM/YYYY");
        else if (e.requestDto?.newStatusId === "done") {
          finishedDate = moment(e.updatedAt).format("DD/MM/YYYY");
        }
      });
    }

    return (
      <>
        <TableCell>{val.taskId}</TableCell>
        <TableCell>{val.taskType}</TableCell>
        <TableCell>{val.statusId}</TableCell>
        <TableCell>{val.assignedTo.agentName}</TableCell>
        <TableCell>{created}</TableCell>
        <TableCell>{assignedDate}</TableCell>
        <TableCell>{startDate}</TableCell>
        <TableCell>{finishedDate}</TableCell>
      </>
    );
  };
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {headCells.map((c) => (
                <TableCell key={c}>{t(c)}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={filteredData.length + 1}
                  align="center"
                  height="200px"
                >
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : (
              <>
                {filteredData?.length > 0 ? (
                  <>
                    {" "}
                    {filteredData.map((c, index) => (
                      <TableRow key={index}>{displayValue(c)}</TableRow>
                    ))}
                  </>
                ) : (
                  <>
                    {" "}
                    <TableRow>
                      <TableCell
                        colSpan={filteredData.length + 1}
                        align="center"
                        height="200px"
                      ></TableCell>
                    </TableRow>
                  </>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ReportsTable;
