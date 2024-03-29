import { useEffect, useMemo, useState } from "react";

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
  TableSortLabel,
  Button,
  Typography,
  MenuItem,
  TextField,
  Alert,
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
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { taskService } from "src/services/task.service";
import Swal from "sweetalert2";
import moment from "moment";
import ModalButton from "src/components/ModalButton";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";
import Modals from "../Components/Modals";

interface State {
  order: "asc" | "desc";
}
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
  const [orderDirection, setOrderDirection] = useState<State>({ order: "asc" });
  const [valueToOrderBy, setValueToOrderBy] = useState("");
  const [xlsData, setXlsData] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [downloading2, setDownloading2] = useState(false);
  const [importType, setImportType] = useState("");
  const [uploadStatus, setUploadStatus] = useState({
    status: "",
    message: "",
  });
  const [open, setOpen] = useState(false);

  const [fileName, setFileName] = useState("");

  const isAdmin = roles.includes("admin");
  const isBackoffice = roles.includes("backoffice");

  const {
    handleFilter: {
      total,
      originalData,
      page,
      setPage,
      setSort,
      limit,
      setLimit,
      loading,
      setLoading,
      selectedRows,
      setSelectedRows,
      getDataAndSet,
      status,
      types,
    },
  } = filterContext;

  const { t } = useTranslation();

  const {
    handleTabs: { setTabsData },
  } = tabsContext;

  useEffect(() => {
    createRows(originalData);
  }, [originalData, status]);

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

  useEffect(() => {
    setSelectedRows([]);
  }, [page]);

  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  };
  const handleOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

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

  const handleRequestSort = (event, property) => {
    const isAscending =
      valueToOrderBy === property && orderDirection.order === "asc";
    setValueToOrderBy(property);
    setOrderDirection(isAscending ? { order: "desc" } : { order: "asc" });
    sortTable(property, isAscending ? "desc" : "asc");
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const sortTable = (value, direction) => {
    const val = { [value]: direction };
    const res = JSON.stringify(val);
    handleSortTable(val, res);
  };

  const statusMap = useMemo(() => {
    return status.reduce((acc, item) => {
      return {
        ...acc,
        [item.Key]: item,
      };
    }, {});
  }, [status]);

  const createRows = (data) => {
    let rows = [];

    data.map((c, idx) => {
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

      c.taskDetails.map((e, i) => {
        if (e.inputType === "date" || e.inputType === "datetime") {
          dynamicDetails.push({
            ...e,
            value: e.value ? moment(e.value).format("DD/MM/YYYY") : "",
            id: e.label,
            order: e.order,
          });
        } else if (e.key === "statusId") {
          const dynamicLabel = statusMap[e.value]?.label;

          dynamicDetails.push({
            ...e,
            value: dynamicLabel || e.value,
          });
        } else {
          dynamicDetails.push({
            ...e,
            value: e.value ?? "",
            id: e.label,
            order: e.order,
          });
        }
      });

      dynamicDetails.sort((a, b) => a.order - b.order);
      details.dynamicDetails = dynamicDetails;

      details.type = c.taskType;
      details.createdAt = c.createdAt
        ? moment(c.createdAt).format("DD/MM/YYYY")
        : "";
      details.assignedTo = c.assignedTo ? c.assignedTo.agentName : "";
      details.lastUpdate = c.lastUpdatedAt
        ? moment(c.lastUpdatedAt).format("DD/MM/YYYY")
        : "";
      details.updatedBy = c.lastUpdatedBy ? c.lastUpdatedBy.userName : "";
      details.executionStartDate = c.executionStartDate;
      details.id = c._id;
      rows.push(details);
    });

    setTableData(rows);
  };

  const headCells = () => {
    let headers = [];

    if (!originalData.length) return headers;

    originalData[0].taskDetails.map((c) => {
      if (c.showInTable)
        headers.push({
          id: c.label,
          label: c.label,
          order: c.order,
          key: c.key,
        });
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

  const handleSortTable = async (e: any, details: string) => {
    if (loading) return;
    try {
      setLoading(true);
      setSort(details);
      await getDataAndSet({
        sort: details,
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
        pageSize: e.target.value,
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

  const download = (data) => {
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute(
      "href",
      "data:text/csv;charset=utf-8,%EF%BB%BF" +
        encodeURI(data).replaceAll("#", "%23")
    );
    a.setAttribute("download", "task_table.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const objectToCsv = (data, allTasks) => {
    const newArr = [];

    const getDetailValues = Object.values(allTasks).map((item: any) => {
      const values = item.taskDetails;

      const detailValues = values.reduce((acc, item) => {
        const detailKey = item.key;
        const detailObj = item.value;

        if (typeof detailObj == null) {
          return { ...acc, [detailKey]: "" };
        }

        if (typeof detailObj === "object") {
          return { ...acc, [detailKey]: `"${detailObj?.value}"` };
        }

        if (typeof detailObj === "string" && typeof detailObj === "number") {
          return { ...acc, [detailKey]: `"${detailObj}"` };
        }

        if (detailKey === "statusId") {
          const statusLabel = status.find((item) => {
            if (item.Key === detailObj) {
              return item.label;
            }
          });

          const getLabel = statusLabel?.label;

          return { ...acc, [detailKey]: `"${getLabel}"` };
        }

        if (Array.isArray(detailObj)) {
          return { ...acc, [detailKey]: `"${detailObj}"` };
        }

        return { ...acc, [detailKey]: detailObj ? `"${detailObj}"` : "" };
      }, {});

      return detailValues;
    });

    const getFormValues = Object.values(allTasks).map((item: any) => {
      const formValues = item.form;

      const formX = formValues?.reduce((acc, item) => {
        const formKey = item.key;
        const formObj = item.value;

        if (formObj == null) {
          return { ...acc, [formKey]: "" };
        }

        if (typeof formObj === "string" || typeof formObj === "number") {
          return { ...acc, [formKey]: `"${formObj}"` };
        }

        // TODO if possible, change to inputtype rather than key
        if (formKey === "lastKnownGeoLocation") {
          if (formObj == null) {
            return {
              ...acc,
              [formKey]: "",
            };
          } else {
            return {
              ...acc,
              [formKey]: `Latitude ${formObj?.coords?.latitude} - Longitude ${formObj?.coords?.longitude} `,
            };
          }
        }

        if (Array.isArray(formObj)) {
          return { ...acc, [formKey]: `"${formObj}"` };
        }

        return { ...acc, [formKey]: formObj ? `"${formObj}"` : "" };
      }, {});

      return formX;
    });

    const newData = data.map((item, index) =>
      Object.assign({}, item, getDetailValues[index], getFormValues[index])
    );

    const taskVal = newData.reduce((acc, cur) => {
      if (acc[cur.taskType]) {
        acc[cur.taskType].push(cur);
      } else {
        Object.assign(acc, { [cur.taskType]: [cur] });
      }

      return acc;
    }, {});

    Object.entries(taskVal).map(([key, value]: [string, any]) => {
      newArr.push("\n");
      newArr.push(key);

      const findKey = value
        .map((item) => Object.keys(item))
        .reduce((acc, cur) => (acc > cur ? acc : cur), {});

      newArr.push(findKey.join(","));

      const taskValues = value.map((item) => item);

      for (const index in taskValues) {
        const val = taskValues[index];

        const a = findKey.map((key) => val[key]);

        newArr.push(a.join(","));
      }
    });

    return newArr.join("\r\n");
  };

  const xlsExport = async () => {
    try {
      setDownloading(true);

      const res = await taskService.getAllTask();

      const tasks = res.data.tasks;

      console.log("tasks", tasks);

      setXlsData(tasks);

      const table = tasks.map((item) => ({
        id: item._id,
        taskId: item.taskId,
        taskType: item.taskType,
        executionStartDate: item.executionStartDate
          ? new Date(item.executionStartDate).toLocaleDateString()
          : "",
        executionEndDate: item.executionEndDate
          ? new Date(item.executionEndDate).toLocaleDateString()
          : "",
        lastUpdatedAt: item.lastUpdatedAt
          ? new Date(item.lastUpdatedAt).toLocaleDateString()
          : "",
        newTaskUuid: item.newTaskUuid,
      }));

      const csvData = objectToCsv(table, tasks);
      download(csvData);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        timer: 4000,
        text: getAxiosErrorMessage(error),
      });
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    const temp = headCells();
    if (temp.length != 0) setHeaders(temp);
  }, [originalData]);

  const csvToJson = (str, comma = ",") => {
    const headers = str.slice(0, str.indexOf("\n")).split(comma);
    const headerFix = headers.map((i) => i.replace(/\r|"|\\/g, ""));

    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    const rowFix = rows.map((i) => i.replace(/\r/g, "")).filter(Boolean);

    const arr = rowFix.map((row) => {
      const rowVal = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      const values = rowVal.map((e) => e.replace(/"/g, "").replace(/\\/g, ""));

      const el = headerFix.reduce((acc, cur, index) => {
        acc[cur] = values[index];
        return acc;
      }, {});
      return el;
    });

    return arr;
  };

  const onSubmit = () => {
    const csvFile = document.getElementById("upload-file") as HTMLInputElement;
    const input = csvFile.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const csv = e.target.result;
      const data = csvToJson(csv);
      try {
        setUploadStatus({
          status: "",
          message: "",
        });
        setDownloading2(true);
        await taskService.import(importType, data);

        const name = fileName;
        setUploadStatus({
          status: "success",
          message: t("success") + " - " + name,
        });

        setFileName("");
      } catch (error) {
        setUploadStatus({
          status: "error",
          message: getAxiosErrorMessage(error),
        });
      } finally {
        setDownloading2(false);
      }
    };

    reader.readAsText(input);
  };

  const handleFileChange = (e) => {
    setUploadStatus({
      status: "",
      message: "",
    });

    const [file] = e.target.files;

    if (file.type !== "text/csv") {
      e.preventDefault();
      setUploadStatus({
        status: "error",
        message: t("fileTypeInvalid"),
      });

      const oldInput = e.target;
      const newInput = document.createElement("input");

      newInput.type = "file";
      newInput.style.cssText = oldInput.style.cssText;
      newInput.id = oldInput.id;
      newInput.onchange = handleFileChange;

      oldInput.parentElement.replaceChild(newInput, oldInput);

      setFileName("");
    } else {
      setFileName(file.name);
    }
  };

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
          {selectedRows.length > 0 && (isAdmin || isBackoffice) ? (
            <Box>
              <AssignTaskForm selected={selectedRows}></AssignTaskForm>
            </Box>
          ) : null}
          {selectedRows.length == 1 && (isAdmin || isBackoffice) ? (
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
                    <TableCell key={c.key}>
                      <TableSortLabel
                        key={c.key}
                        active={valueToOrderBy === c.key}
                        direction={
                          valueToOrderBy === c.key
                            ? orderDirection.order
                            : "asc"
                        }
                        onClick={createSortHandler(c.key)}
                      >
                        {t(c.label)}
                      </TableSortLabel>
                    </TableCell>
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
                  onClick={() =>
                    selectedRows.indexOf(rows.id) >= 0
                      ? unSelectRow(rows.id)
                      : createSelectedRows(rows.id)
                  }
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
                        value = value.value;
                        id = value.id;
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
      <Box
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          {isAdmin ? (
            <Button
              disabled={loading || downloading}
              variant="contained"
              onClick={xlsExport}
              sx={{ marginRight: 2 }}
            >
              {loading || downloading ? (
                <CircularProgress size={18} />
              ) : (
                <>
                  <Typography variant="h5" sx={{ mr: "5px" }}>
                    {t("download")}
                  </Typography>
                  <DownloadIcon fontSize="small" />
                </>
              )}
            </Button>
          ) : null}
          {isAdmin || isBackoffice ? (
            <>
              <Button
                variant="contained"
                disabled={loading || downloading}
                onClick={handleOpen}
                sx={{ marginRight: 2 }}
              >
                {loading || downloading2 ? (
                  <CircularProgress size={18} />
                ) : (
                  <>
                    <Typography variant="h5" sx={{ mr: "5px" }}>
                      {t("upload")}
                    </Typography>
                    <FileUploadIcon fontSize="small" />
                  </>
                )}
              </Button>
              <Modals onClose={handleClose} open={open} title={t("upload")}>
                <Box display="flex" flexDirection="column" gap={2} pt={2}>
                  {uploadStatus.status !== "" ? (
                    <Alert severity={uploadStatus.status as any}>
                      {uploadStatus.message}
                    </Alert>
                  ) : null}
                  {fileName !== "" ? (
                    <Alert severity="info">{`${t(
                      "fileName"
                    )}: ${fileName}`}</Alert>
                  ) : null}
                  <Box
                    display="flex"
                    flexDirection="row"
                    gap={2}
                    alignItems="center"
                  >
                    <TextField
                      select
                      onChange={(e) => setImportType(e.target.value)}
                      required
                      label={t("taskType")}
                      fullWidth
                    >
                      {types.map((item) => (
                        <MenuItem key={item.key} value={item.key}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Box sx={{ width: "20%" }}>
                      <div>
                        <input
                          style={{ display: "none" }}
                          id="upload-file"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </div>
                      <label htmlFor="upload-file">
                        <Button
                          disabled={loading || downloading2}
                          variant="outlined"
                          component="span"
                        >
                          {t("upload")}
                        </Button>
                      </label>
                    </Box>
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={onSubmit}
                    disabled={loading || downloading2}
                  >
                    {loading || downloading2 ? (
                      <CircularProgress size={20} />
                    ) : (
                      t("submit")
                    )}
                  </Button>
                </Box>
              </Modals>
            </>
          ) : null}
        </Box>
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
