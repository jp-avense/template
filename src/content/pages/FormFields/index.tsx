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
import { formService } from "src/services/form.service";
import FormFieldForm from "./CreateFormFieldForm";

const headerKeys = [
  {
    key: "key",
    label: "Key",
  },
  {
    key: "inputType",
    label: "Input Type",
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
    key: "note",
    label: "Note",
  }
];

const FormFields = () => {
  const [forms, setForms] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    formService
      .getFields()
      .then(({ data }) => {
        const h = Object.keys(data[0])
          .filter((item) => item !== "_id")
          .map((item) => {
            return {
              key: item,
              label: item.charAt(0).toUpperCase() + item.slice(1),
            };
          });

        setHeaders(headerKeys);
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
        </Card>
      </Box>
    </>
  );
};

export default FormFields;
