import { Box, Button, Card } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import { getAxiosErrorMessage } from "src/lib";
import { taskService } from "src/services/task.service";
import Swal from "sweetalert2";
import DragTable from "./DragTable";
import CreateStatus from "./CreateStatus";
import CreateStatusForm from "./CreateStatus/CreateStatusForm";
import { ITaskStatus, TaskStatusState } from "./status.interface";
import UpdateStatus from "./UpdateStatus";
import UpdateStatusForm from "./UpdateStatus/UpdateStatusForm";
import ConfirmModal from "src/components/ConfirmModal";
import { useTranslation } from "react-i18next";
import Label from "src/components/Label";

interface State {
  order: "asc" | "desc";
}

const TaskStatusPage = () => {
  const [status, setStatus] = useState<ITaskStatus[]>([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [orderDirection, setOrderDirection] = useState<State>({ order: "asc" });
  const [valueToOrderBy, setValueToOrderBy] = useState("");

  const {
    t,
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    setLoading(true);
    taskService
      .getStatuses()
      .then(({ data }) => {
        data.sort((a, b) => a.order - b.order);
        setStatus(data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const tableHeaders = [
      {
        key: "Key",
        label: t("key"),
      },
      {
        key: "label",
        label: t("label"),
      },
      {
        key: "description",
        label: t("description"),
      },
      {
        key: "isSystemStatus",
        label: t("isSystemStatus"),
        render: (value) => {
          return (
            <Label color={value ? "success" : "error"}>
              {t(value?.toString()) || t("false")}
            </Label>
          );
        },
      },
      {
        key: "state",
        label: t("state"),
        render: (value) => {
          return (
            <Label color={value === "enabled" ? "success" : "error"}>
              {t(value)}
            </Label>
          );
        },
      },
      {
        key: "systemStatusKey",
        label: t("systemStatusKey"),
      },
    ];

    setHeaders(tableHeaders);
  }, [language]);

  const handleSelectOne = (id: string) => {
    let res = [];

    if (!selected.includes(id)) res = [...selected, id];
    else res = selected.filter((item) => item !== id);

    setSelected(res);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const ids = status.map((item) => item._id);
      setSelected(ids);
    } else {
      setSelected([]);
    }
  };

  const updateStatusObject = useMemo(() => {
    if (selected.length > 1) return null;

    return status.find((item) => item._id === selected[0]);
  }, [selected, status]);

  const onDone = async () => {
    setLoading(true);
    try {
      const { data } = await taskService.getStatuses();
      setStatus(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        timer: 4000,
        text: getAxiosErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const changeState = async (newStatus: TaskStatusState) => {
    try {
      setLoading(true);
      await taskService.changeState(selected, newStatus);
      setSelected([]);

      const slice = status.slice().map((item) => ({
        ...item,
        state: selected.includes(item._id) ? newStatus : item.state,
      }));

      setStatus(slice);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: getAxiosErrorMessage(error),
        timer: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await taskService.bulkDeleteStatus(selected);

      const filtered = status.filter((item) => !selected.includes(item._id));
      setSelected([]);
      setStatus(filtered);
    } catch (error) {
      Swal.fire({
        icon: "error",
        timer: 4000,
        text: getAxiosErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = () => changeState(TaskStatusState.DISABLED);
  const handleEnable = () => changeState(TaskStatusState.ENABLED);

  const handleDragDrop = async (e, source, target) => {
    const sourceidx = status.findIndex((item) => item._id === source);
    const targetidx = status.findIndex((item) => item._id === target);

    const sourceObj = status[sourceidx];
    const targetObj = status[targetidx];

    const newSource = {
      ...targetObj,
      order: sourceObj.order,
    };

    const newTarget = {
      ...sourceObj,
      order: targetObj.order,
    };

    try {
      const data = [
        {
          id: newSource._id,
          newOrder: newSource.order,
        },
        {
          id: newTarget._id,
          newOrder: newTarget.order,
        },
      ];

      await taskService.bulkChangeStatusOrder(data);

      const slice = status.slice();

      slice.splice(sourceidx, 1, newSource);
      slice.splice(targetidx, 1, newTarget);

      const dup = slice.map((item) => ({ ...item }));

      setStatus(dup);
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: getAxiosErrorMessage(err),
        title: "Error",
      });
    }
  };

  const handleRequestSort = (event, property) => {
    const isAscending =
      valueToOrderBy === property && orderDirection.order === "asc";
    setValueToOrderBy(property);
    setOrderDirection(isAscending ? { order: "desc" } : { order: "asc" });
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (orderBy === "isSystemStatus" || orderBy === "description") {
      return b[orderBy] - a[orderBy];
    }

    if (orderBy) {
      return b[orderBy].localeCompare(a[orderBy]);
    }

    return 0;
  };

  const sorted = () => {
    const sort = sortedRowInformation(
      status,
      getComparator(orderDirection.order, valueToOrderBy)
    );
    return sort;
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const sortedRowInformation = (rowArray, comparator) => {
    const stabilizedRowArray = rowArray.map((el, index) => [el, index]);
    stabilizedRowArray.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    const res = stabilizedRowArray.map((el) => el[0]);
    return res;
  };

  return (
    <div>
      <Helmet>
        <title>{t("systemTaskStatus")}</title>
      </Helmet>
      <PageTitleWrapper>
        <CreateStatus>
          <CreateStatusForm onDone={onDone} />
        </CreateStatus>
      </PageTitleWrapper>
      <Box display="flex" justifyContent="center">
        <Card sx={{ width: "80%" }}>
          <DragTable
            data={status}
            headers={headers}
            selected={selected}
            title="Status"
            loading={loading}
            handleSelectOne={handleSelectOne}
            handleSelectAll={handleSelectAll}
            handleDragDrop={handleDragDrop}
            sort={true}
            sorted={sorted}
            createSortHandler={createSortHandler}
            orderDirection={orderDirection}
            valueToOrderBy={valueToOrderBy}
            action={
              <Box display="flex" flexDirection="row" gap={1}>
                {selected.length === 1 ? (
                  <>
                    <UpdateStatus>
                      <UpdateStatusForm
                        selectedStatus={updateStatusObject}
                        onDone={onDone}
                      />
                    </UpdateStatus>
                  </>
                ) : null}
                {selected.length > 0 ? (
                  <>
                    <ConfirmModal
                      buttonText={t("delete")}
                      title={t("delete")}
                      handleConfirm={() => handleDelete()}
                      confirmMessage={t("deleteSomeStatus")}
                      confirmText={t("submit")}
                      buttonProps={{
                        variant: "contained",
                        color: "warning",
                      }}
                    />
                    <Button
                      type="button"
                      variant="contained"
                      color="success"
                      onClick={handleEnable}
                    >
                      {t("enable")}
                    </Button>
                    <Button
                      type="button"
                      variant="contained"
                      color="error"
                      onClick={handleDisable}
                    >
                      {t("disable")}
                    </Button>
                  </>
                ) : null}
              </Box>
            }
          ></DragTable>
        </Card>
      </Box>
    </div>
  );
};

export default TaskStatusPage;
