import { useEffect, useState, useMemo } from "react";
import { Box, Card } from "@mui/material";
import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import { useTranslation } from "react-i18next";
import CreateTaskDetail from "./CreateTaskDetail";
import CreateTaskDetailForm from "./CreateTaskDetail/CreateTaskDetailForm";
import { IDetails } from "./details.interface";
import { taskService } from "src/services/task.service";
import Swal from "sweetalert2";
import { getAxiosErrorMessage } from "src/lib";
import DynamicTable from "../Components/DynamicTable";
import ConfirmModal from "src/components/ConfirmModal";
import UpdateTaskDetail from "./UpdateTaskDetail";
import UpdateTaskDetailForm from "./UpdateTaskDetail/UpdateTaskDetailForm";

const TaskDetailPage = () => {
  const [loading, setLoading] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [details, setDetails] = useState<IDetails[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const {
    t,
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    setLoading(true);
    init();
  }, []);

  useEffect(() => {
    const tableHeaders = [
      {
        key: "key",
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
    ];

    setHeaders(tableHeaders);
  }, [language]);

  const init = async () => {
    const headers = [
      {
        key: "key",
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
    ];

    try {
      setLoading(true);

      const { data: response }: { data: IDetails[] } =
        await taskService.getDetails();
      setDetails(response);

      setHeaders(headers);
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

  const handleSelectOne = (id: string) => {
    let res = [];

    if (!selected.includes(id)) res = [...selected, id];
    else res = selected.filter((item) => item !== id);

    setSelected(res);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const ids = details.map((item) => item._id);
      setSelected(ids);
    } else {
      setSelected([]);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      // await taskService.bulkDeleteDetails(selected);

      const filtered = details.filter((item) => !selected.includes(item._id));

      setSelected([]);
      setDetails(filtered);
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

  const updateDetail = useMemo(() => {
    return details.find((item) => item._id === selected[0]);
  }, [selected, details]);

  const onDone = (e) => {
    console.log(e);
  };

  return (
    <div>
      <Helmet>
        <title>{t("taskDetails")}</title>
      </Helmet>
      <PageTitleWrapper>
        <CreateTaskDetail>
          <CreateTaskDetailForm onDone={onDone} />
        </CreateTaskDetail>
      </PageTitleWrapper>
      <Box display="flex" justifyContent="center" pb={4}>
        <Card sx={{ width: "80%" }}>
          <DynamicTable
            data={details}
            headers={headers}
            selected={selected}
            title={t("taskDetails")}
            loading={loading}
            handleSelectOne={handleSelectOne}
            handleSelectAll={handleSelectAll}
            action={
              <Box display="flex" flexDirection="row" gap={1}>
                {selected.length === 1 ? (
                  <>
                    <UpdateTaskDetail>
                      <UpdateTaskDetailForm
                        selectedDetail={updateDetail}
                        onDone={init}
                      />
                    </UpdateTaskDetail>
                  </>
                ) : null}
                {selected.length ? (
                  <ConfirmModal
                    buttonText={t("delete")}
                    title={t("delete")}
                    handleConfirm={() => handleDelete()}
                    confirmMessage={t("deleteSomeTypes")}
                    confirmText={t("submit")}
                    buttonProps={{
                      variant: "contained",
                      color: "warning",
                    }}
                  />
                ) : null}
              </Box>
            }
          ></DynamicTable>
        </Card>
      </Box>
    </div>
  );
};

export default TaskDetailPage;
