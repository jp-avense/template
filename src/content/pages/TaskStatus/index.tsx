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

const tableHeaders = [
  {
    key: "Key",
    label: "Key",
  },
  {
    key: "label",
    label: "Label",
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "isSystemStatus",
    label: "Is System Status?",
  },
  {
    key: "state",
    label: "State",
  },
  {
    key: "systemStatusKey",
    label: "System Status Key",
  },
];

const TaskStatusPage = () => {
  const [status, setStatus] = useState<ITaskStatus[]>([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    taskService
      .getStatuses()
      .then(({ data }) => {
        data.sort((a, b) => a.order - b.order);

        setHeaders(tableHeaders);
        setStatus(data);
      })
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <div>
      <Helmet>
        <title>System - Task Status</title>
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
            action={
              <Box display="flex" flexDirection="row" gap={1}>
                {selected.length > 0 ? (
                  <>
                    <Button
                      type="button"
                      variant="contained"
                      color="success"
                      onClick={handleEnable}
                    >
                      Enable
                    </Button>
                    <Button
                      type="button"
                      variant="contained"
                      color="error"
                      onClick={handleDisable}
                    >
                      Disable
                    </Button>
                  </>
                ) : null}
                {selected.length === 1 ? (
                  <UpdateStatus>
                    <UpdateStatusForm
                      selectedStatus={updateStatusObject}
                      onDone={onDone}
                    />
                  </UpdateStatus>
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
