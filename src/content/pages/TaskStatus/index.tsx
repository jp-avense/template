import { Box, Button, Card } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import { getAxiosErrorMessage } from "src/lib";
import { taskService } from "src/services/task.service";
import Swal from "sweetalert2";
import DynamicTable from "../Components/DynamicTable";
import CreateStatus from "./CreateStatus";
import CreateStatusForm from "./CreateStatus/CreateStatusForm";
import UpdateStatus from "./UpdateStatus";
import UpdateStatusForm from "./UpdateStatus/UpdateStatusForm";

const TaskStatusPage = () => {
  const [status, setStatus] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    taskService
      .getStatuses()
      .then(({ data }) => {
        const h = Object.keys(data[0])
          .filter((item) => item !== "_id")
          .map((item) => {
            return {
              key: item,
              label: item.charAt(0).toUpperCase() + item.slice(1),
            };
          });

        setStatus(data);
        setHeaders(h);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelectOne = (e, id: string) => {
    let res = [];

    if (e.target.checked && !selected.includes(id)) res = [...selected, id];
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
          <DynamicTable
            data={status}
            headers={headers}
            selected={selected}
            title="Status"
            loading={loading}
            handleSelectOne={handleSelectOne}
            handleSelectAll={handleSelectAll}
            action={
              selected.length === 1 ? (
                <Box display="flex" flexDirection="row" gap={2}>
                  <UpdateStatus>
                    <UpdateStatusForm
                      selectedStatus={updateStatusObject}
                      onDone={onDone}
                    />
                  </UpdateStatus>
                </Box>
              ) : null
            }
          ></DynamicTable>
        </Card>
      </Box>
    </div>
  );
};

export default TaskStatusPage;
