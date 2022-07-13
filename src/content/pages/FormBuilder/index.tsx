import { useState, useEffect, useMemo } from "react";
import { Box, Button, Card } from "@mui/material";
import { t } from "i18next";
import { Helmet } from "react-helmet-async";
import { getAxiosErrorMessage } from "src/lib";
import { taskService } from "src/services/task.service";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import FormBuilderHeader from "./FormBuilderHeader";
import ConfirmModal from "src/components/ConfirmModal";
import DynamicTable from "../Components/DynamicTable";
import Swal from "sweetalert2";
import axios from "axios";
import { formService } from "src/services/form.service";
// import FormFieldForm from "./CreateFormFieldForm";
// import UpdateForms from "./UpdateForm";
// import UpdateFormField from "./UpdateForm/UpdateFormField";

const headerKeys = [
  {
    key: "name",
    label: "Form name",
  },
  {
    key: "type",
    label: "Type",
  },
  {
    key: "description",
    label: "Description",
  },
];

const FormBuilder = () => {
  const [forms, setForms] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>(["1"]);

  useEffect(() => {
    setLoading(true);
    const jsonData = require("./sample.json");
    setHeaders(headerKeys);
    setForms(jsonData);
    setLoading(false);
  }, []);

  const handleSelectOne = (id: string) => {
    let res = [];

    if (!selected.includes(id)) res = [...selected, id];
    else res = selected.filter((item) => item !== id);

    setSelected(res);
  };

  const editForm = useMemo(() => {
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

  return (
    <>
      <Helmet>
        <title>{t("formFields")}</title>
      </Helmet>
      <PageTitleWrapper>
        <FormBuilderHeader>
          {/* <FormBuilderForm onDone={onDone} /> */}
        </FormBuilderHeader>
      </PageTitleWrapper>
      <Box display="flex" justifyContent="center">
        <Card sx={{ width: "80%" }}>
          <DynamicTable
            data={forms}
            headers={headers}
            selected={selected}
            title="Form Builder"
            loading={loading}
            handleSelectOne={handleSelectOne}
            handleSelectAll={handleSelectAll}
            action={
              <Box display="flex" flexDirection="row" gap={1}>
                {selected.length === 1 ? (
                  <>
                    {/* <EditForms>
                      <EditFormField
                        selectedForm={EditForm}
                        onFinish={onFinish}
                      />
                    </EditForms> */}
                  </>
                ) : null}
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

export default FormBuilder;
