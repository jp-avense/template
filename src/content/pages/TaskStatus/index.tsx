import { Box, Card } from "@mui/material";
import { useEffect, useState } from "react";
import { taskService } from "src/services/task.service";
import DynamicTable from "../Components/DynamicTable";

const TaskStatusPage = () => {
  const [status, setStatus] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
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

  return (
    <div>
      {loading ? (
        "loading..."
      ) : (
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
            ></DynamicTable>
          </Card>
        </Box>
      )}
    </div>
  );
};

export default TaskStatusPage;
