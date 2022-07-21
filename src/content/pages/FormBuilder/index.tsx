import { useState, useEffect, useMemo } from "react";
import { Box, Card } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { getAxiosErrorMessage } from "src/lib";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import FormBuilderHeader from "./FormBuilderHeader";
import ConfirmModal from "src/components/ConfirmModal";
import Swal from "sweetalert2";
import { formService } from "src/services/form.service";
import PreviewTable from "./PreviewTable";

const FormBuilder = () => {
  const [forms, setForms] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const {
    t,
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const headerKeys = [
      {
        key: "name",
        label: t("name"),
      },
      {
        key: "type",
        label: t("type"),
      },
      {
        key: "description",
        label: t("description"),
      },
    ];

    setHeaders(headerKeys);
  }, [language]);

  const init = async () => {
    setLoading(true);
    try {
      const { data } = await formService.getForms();
      setForms(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: getAxiosErrorMessage(error),
        timer: 4000,
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
      const ids = forms.map((item) => item._id);
      setSelected(ids);
    } else {
      setSelected([]);
    }
  };

  const handleDelete = async () => {
    return;
  };

  return (
    <>
      <Helmet>
        <title>{t("formBuilder")}</title>
      </Helmet>
      <PageTitleWrapper>
        <FormBuilderHeader>
          {/* <FormBuilderForm onDone={onDone} /> */}
        </FormBuilderHeader>
      </PageTitleWrapper>
      <Box display="flex" justifyContent="center">
        <Card sx={{ width: "80%" }}>
          <PreviewTable
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
                    buttonText={t("delete")}
                    title={t("delete")}
                    handleConfirm={() => handleDelete()}
                    confirmMessage={t("deleteSomeForms")}
                    confirmText={t("submit")}
                    buttonProps={{
                      variant: "contained",
                      color: "warning",
                    }}
                  />
                ) : null}
              </Box>
            }
          ></PreviewTable>
        </Card>
      </Box>
    </>
  );
};

export default FormBuilder;
