import { useState, useEffect, useMemo } from "react";
import { Box, Card } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { getAxiosErrorMessage } from "src/lib";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import FormFieldHeader from "./FormFieldsHeader";
import ConfirmModal from "src/components/ConfirmModal";
import DynamicTable from "../Components/DynamicTable";
import Swal from "sweetalert2";
import { formService } from "src/services/form.service";
import FormFieldForm from "./CreateFormFieldForm";
import UpdateForms from "./UpdateForm";
import UpdateFormField from "./UpdateForm/UpdateFormField";
import DuplicateForm from "./DuplicateForm";
import DuplicateFormField from "./DuplicateForm/DuplicateFormField";
import { useTranslation } from "react-i18next";

interface State {
  order: "asc" | "desc";
}

const FormFields = () => {
  const [forms, setForms] = useState([]);
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
    formService
      .getFields()
      .then(({ data }) => {
        setForms(data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const headerKeys = [
      {
        key: "key",
        label: t("key"),
      },
      {
        key: "inputType",
        label: t("inputType"),
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
        key: "note",
        label: t("note"),
      },
    ];

    setHeaders(headerKeys);
  }, [language]);

  const handleSelectOne = (id: string) => {
    let res = [];

    if (!selected.includes(id)) res = [...selected, id];
    else res = selected.filter((item) => item !== id);

    setSelected(res);
  };

  const updateForm = useMemo(() => {
    return forms.find((item) => item._id === selected[0]);
  }, [selected, forms]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const ids = forms.map((item) => item._id);
      setSelected(ids);
    } else {
      setSelected([]);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await formService.bulkDeleteFormFields(selected);

      const filtered = forms.filter((item) => !selected.includes(item._id));
      setSelected([]);
      setForms(filtered);
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
      const { data } = await formService.getFields();
      setForms(data);
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

  const onDone = async () => {
    setLoading(true);
    try {
      const { data } = await formService.getFields();
      setForms(data);
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
    if (orderBy) {
      return b[orderBy].localeCompare(a[orderBy]);
    }
    return 0;
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
        <title>{t("formFields")}</title>
      </Helmet>
      <PageTitleWrapper>
        <FormFieldHeader>
          <FormFieldForm onDone={onDone} />
        </FormFieldHeader>
      </PageTitleWrapper>
      <Box display="flex" justifyContent="center" pb={5}>
        <Card sx={{ width: "80%" }}>
          <DynamicTable
            data={forms}
            headers={headers}
            selected={selected}
            title={t("fieldForms")}
            loading={loading}
            handleSelectOne={handleSelectOne}
            handleSelectAll={handleSelectAll}
            sort={true}
            sortedRowInformation={sortedRowInformation}
            createSortHandler={createSortHandler}
            getComparator={getComparator}
            orderDirection={orderDirection}
            valueToOrderBy={valueToOrderBy}
            action={
              <Box display="flex" flexDirection="row" gap={1}>
                {selected.length === 1 ? (
                  <>
                    <UpdateForms>
                      <UpdateFormField
                        selectedForm={updateForm}
                        onFinish={onFinish}
                      />
                    </UpdateForms>

                    <DuplicateForm>
                      <DuplicateFormField
                        selectedForm={updateForm}
                        onFinish={onFinish}
                      />
                    </DuplicateForm>
                  </>
                ) : null}
                {selected.length ? (
                  <ConfirmModal
                    buttonText={t("delete")}
                    title={t("delete")}
                    handleConfirm={() => handleDelete()}
                    confirmMessage={t("deleteSomeFields")}
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

export default FormFields;
