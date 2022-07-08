import { Box, Card } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import { getAxiosErrorMessage } from "src/lib";
import { taskService } from "src/services/task.service";
import Swal from "sweetalert2";
import DynamicTable from "../Components/DynamicTable";
import CreateType from "./CreateType";
import CreateTypeForm from "./CreateType/CreateTypeForm";
import UpdateType from "./UpdateType";
import UpdateTypeForm from "./UpdateType/UpdateTypeForm";

const TaskTypePage = () => {
  const [types, setTypes] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    taskService
      .getTaskTypes()
      .then(({ data }) => {
        console.log(data);
        const h = Object.keys(data[0])
          .filter((item) => item !== "_id")
          .map((item) => {
            return {
              key: item,
              label: item.charAt(0).toUpperCase() + item.slice(1),
            };
          });
        setTypes(data);
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
      const ids = types.map((item) => item._id);
      setSelected(ids);
    } else {
      setSelected([]);
    }
  };

  const updateType = useMemo(() => {
    return types.find((item) => item._id === selected[0]);
  }, [selected, types]);

  const onFinish = async () => {
    setLoading(true);
    try {
      const { data } = await taskService.getTaskTypes();
      setTypes(data);
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
    <>
      <Helmet>
        <title>Task Type</title>
      </Helmet>
      <PageTitleWrapper>
        <CreateType>
          <CreateTypeForm onFinish={onFinish} />
        </CreateType>
      </PageTitleWrapper>
      <Box display="flex" justifyContent="center">
        <Card sx={{ width: "80%" }}>
          <DynamicTable
            data={types}
            headers={headers}
            selected={selected}
            title="Task Types"
            loading={loading}
            handleSelectOne={handleSelectOne}
            handleSelectAll={handleSelectAll}
            action={
              selected.length === 1 ? (
                <Box display="flex" flexDirection="row" gap={2}>
                  <UpdateType>
                    <UpdateTypeForm
                      selectedType={updateType}
                      onFinish={onFinish}
                    />
                  </UpdateType>
                </Box>
              ) : null
            }
          ></DynamicTable>
        </Card>
      </Box>
    </>
  );
};
export default TaskTypePage;
