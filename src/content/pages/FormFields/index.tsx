import { useState, useEffect } from "react";
import { Box, Button, Card } from "@mui/material";
import { t } from "i18next";
import { Helmet } from "react-helmet-async";
import { getAxiosErrorMessage } from "src/lib";
import { taskService } from "src/services/task.service";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import FormFieldHeader from "./FormFieldsHeader";
import FormFieldsTable from "./FormFieldsTable";
import ConfirmModal from "src/components/ConfirmModal";
import DynamicTable from "../Components/DynamicTable";
import Swal from "sweetalert2";
import axios from "axios";

const headerKeys = [
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
];

const FormFields = () => {
  const [forms, setForms] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    // taskService
    //   .getTaskTypes()
    axios
      .get("https://jsonplaceholder.typicode.com/todos")
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
        // data.sort((a, b) => a.order - b.order);

        setHeaders(h);
        setForms(data);
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
      const ids = forms.map((item) => item._id);
      setSelected(ids);
    } else {
      setSelected([]);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      // await taskFormFields.bulkDeleteFormFields(selected);

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

  return (
    <>
      <Helmet>
        <title>{t("Form fields")}</title>
      </Helmet>
      <PageTitleWrapper>
        <FormFieldHeader />
      </PageTitleWrapper>
      <Box display="flex" justifyContent="center">
        <Card sx={{ width: "80%" }}>
          <DynamicTable
            data={forms}
            headers={headers}
            selected={selected}
            title="Field Forms"
            loading={loading}
            handleSelectOne={handleSelectOne}
            handleSelectAll={handleSelectAll}
            action={
              <Box display="flex" flexDirection="row" gap={1}>
                {selected.length === 1 ? <></> : null}
                {selected.length ? (
                  <ConfirmModal
                    buttonText="Delete"
                    title="Delete forms"
                    handleConfirm={() => handleDelete()}
                    confirmMessage="You are about to delete some forms. Continue?"
                    confirmText="Confirm"
                    buttonProps={{
                      variant: "contained",
                      color: "warning",
                    }}
                  />
                ) : null}
              </Box>
            }
          ></DynamicTable>
          {/* <FormFieldsTable
            data={forms}
            headers={headers}
            selected={selected}
            title="Field Forms"
            loading={loading}
            handleSelectOne={handleSelectOne}
            handleSelectAll={handleSelectAll}
            action={
              <Box display="flex" flexDirection="row" gap={1}>
                {selected.length === 1 ? <></> : null}
                {selected.length > 0 ? (
                  <>
                    <ConfirmModal
                      buttonText="Delete"
                      title="Delete form field"
                      handleConfirm={() => handleDelete()}
                      confirmMessage="Are you sure you want to delete some form fields?"
                      confirmText="Confirm"
                      buttonProps={{
                        variant: "contained",
                        color: "warning",
                      }}
                    />
                  </>
                ) : null}
              </Box>
            }
          ></FormFieldsTable> */}
        </Card>
      </Box>
    </>
  );
};

export default FormFields;
