import { Box, Card } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import ConfirmModal from "src/components/ConfirmModal";
import ModalButton from "src/components/ModalButton";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import { getAxiosErrorMessage } from "src/lib";
import { formService } from "src/services/form.service";
import { taskService } from "src/services/task.service";
import Swal from "sweetalert2";
import DynamicTable from "../Components/DynamicTable";
import { Form } from "../FormBuilder/form.interface";
import CreateType from "./CreateType";
import CreateTypeForm from "./CreateType/CreateTypeForm";
import DuplicateTypeForm from "./DuplicateType";
import { TaskType } from "./type.interface";
import UpdateType from "./UpdateType";
import UpdateTypeForm from "./UpdateType/UpdateTypeForm";
import Label from "src/components/Label";
import PreviewModal from "../FormBuilder/PreviewTable/PreviewModal";

interface State {
  order: "asc" | "desc";
}

const TaskTypePage = () => {
  const [types, setTypes] = useState<TaskType[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
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
    init();
  }, []);

  useEffect(() => {
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

    setHeaders(headers);
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

      const { data: response }: { data: Form[] } = await formService.getForms();
      setForms(response);

      const { data } = await taskService.getTaskTypes();

      for (const d of data) {
        if (typeof d.form !== "object") {
          d.form = { execute: d.form };
        }

        for (const [key, value] of Object.entries(d.form)) {
          const f = response.find((item) => item._id === value);

          d.form[key] = f;
        }
      }

      setTypes(data);
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
      const ids = types.map((item) => item._id);
      setSelected(ids);
    } else {
      setSelected([]);
    }
  };

  const updateType = useMemo(() => {
    return types.find((item) => item._id === selected[0]);
  }, [selected, types]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await taskService.bulkDeleteType(selected);

      const filtered = types.filter((item) => !selected.includes(item._id));
      setSelected([]);
      setTypes(filtered);
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

  const firstSelectedObject = useMemo(() => {
    const res = types.find((item) => item._id === selected[0]);
    return res;
  }, [selected]);

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
    if (orderBy === "key" || orderBy === "label" || orderBy === "description") {
      return b[orderBy].localeCompare(a[orderBy]);
    }
    return 0;
  };

  const sorted = () => {
    const sort = sortedRowInformation(
      types,
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
    <>
      <Helmet>
        <title>{t("taskType")}</title>
      </Helmet>
      <PageTitleWrapper>
        <CreateType>
          <CreateTypeForm onFinish={init} forms={forms} />
        </CreateType>
      </PageTitleWrapper>
      <Box display="flex" justifyContent="center" pb={4}>
        <Card sx={{ width: "80%" }}>
          <DynamicTable
            data={types}
            headers={headers}
            selected={selected}
            title={t("taskTypes")}
            loading={loading}
            handleSelectOne={handleSelectOne}
            handleSelectAll={handleSelectAll}
            sort={true}
            sorted={sorted}
            createSortHandler={createSortHandler}
            orderDirection={orderDirection}
            valueToOrderBy={valueToOrderBy}
            action={
              <Box display="flex" flexDirection="row" gap={1}>
                {selected.length === 1 ? (
                  <>
                    <UpdateType>
                      <UpdateTypeForm
                        selectedType={updateType}
                        onFinish={init}
                        forms={forms}
                      />
                    </UpdateType>
                    <ModalButton
                      text={t("duplicate")}
                      title={t("duplicate")}
                      buttonProps={{ variant: "contained", color: "secondary" }}
                    >
                      <DuplicateTypeForm
                        onFinish={init}
                        source={firstSelectedObject}
                      />
                    </ModalButton>
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
    </>
  );
};
export default TaskTypePage;
