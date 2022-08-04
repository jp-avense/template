import { useState, useEffect, useMemo } from "react";
import { Box, Button, Card, Grid } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { getAxiosErrorMessage } from "src/lib";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import FormFieldHeader from "./AppSettingsHeader";
import ConfirmModal from "src/components/ConfirmModal";
import DynamicTable from "../Components/DynamicTable";
import Modals from "../Components/Modals";
import Swal from "sweetalert2";
import Label from "src/components/Label";
import ValueModal from "./ValueModal";
import UpdateAppSettings from "./UpdateAppSettings";
import UpdateAppSettingsForm from "./UpdateAppSettings/UpdateAppSettingsForm";
import { settingsService } from "src/services/settings.service";

import { useTranslation } from "react-i18next";
import AddAppSettingsForm from "./AddAppSettingsForm";

const AppSettings = () => {
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpenPopup] = useState(false);
  const handleClose = () => {
    setOpenPopup(false);
  };

  const {
    t,
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      const res = await settingsService.getAll();
      return res.data;
    };

    fetchData().then((res) => {
      const current = res.reduce((acc, item: any) => {
        try {
          const val = JSON.parse(item.value);
          item.value = val;
        } catch (e) {
          item.value = item.value;
        }
        acc = [...acc, item];

        return acc;
      }, []);
      setData(current);
    });
  }, []);

  useEffect(() => {
    const headerKeys = [
      {
        key: "key",
        label: t("key"),
      },
      {
        key: "value",
        label: t("value"),
        render: (data) => {
          return data ? (
            <ValueModal data={data} title={data.value} />
          ) : (
            <Label color="error">{t("none")}</Label>
          );
        },
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
    if (selected.length === 1) {
      const res = data.find((item) => item._id === selected[0]);
      if (typeof res.value === "object" && Array.isArray(res.value)) {
        if (typeof res.value[0] === "object") {
          res.type = "Object";
        } else if (typeof res.value[0] === "string") {
          res.type = "Array";
        }
      } else if (typeof res.value === "object") {
        res.type = "Object";
      } else if (typeof res.value === "string") {
        res.type = "String";
      } else if (typeof res.value === "number") {
        res.type = "Number";
      }

      return res;
    }
  }, [selected, data]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const ids = data.map((item) => item._id);
      setSelected(ids);
    } else {
      setSelected([]);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      //   await formService.bulkDeleteFormFields(selected);

      const filtered = data.filter((item) => !selected.includes(item._id));
      setSelected([]);
      setData(filtered);
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
      //   const { data } = await formService.getFields();
      //   setForms(data);
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
      const fetchData = async () => {
        const res = await settingsService.getAll();
        return res.data;
      };

      fetchData().then((res) => {
        const current = res.reduce((acc, item: any) => {
          try {
            const val = JSON.parse(item.value);
            item.value = val;
          } catch (e) {
            item.value = item.value;
          }
          acc = [...acc, item];

          return acc;
        }, []);
        setData(current);
      });
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
          <AddAppSettingsForm onDone={onDone} data={data} />
        </FormFieldHeader>
      </PageTitleWrapper>
      <Box display="flex" justifyContent="center" pb={5}>
        <Card sx={{ width: "80%" }}>
          <DynamicTable
            data={data}
            headers={headers}
            selected={selected}
            title={t("appSettings")}
            loading={loading}
            handleSelectOne={handleSelectOne}
            handleSelectAll={handleSelectAll}
            action={
              <Box display="flex" flexDirection="row" gap={1}>
                {selected.length === 1 ? (
                  <>
                    <UpdateAppSettings>
                      <UpdateAppSettingsForm
                        data={data}
                        selected={updateForm}
                        onDone={onDone}
                      />
                    </UpdateAppSettings>
                  </>
                ) : null}
                {/* {selected.length ? (
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
                ) : null} */}
              </Box>
            }
          ></DynamicTable>
        </Card>
      </Box>
    </>
  );
};

export default AppSettings;
