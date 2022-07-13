import { useState } from "react";

import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import FormFieldSideBar from "./Sidebar/FormFieldSideBar";

const FormBuilder = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("Form Builder")}</title>
      </Helmet>
      <FormFieldSideBar />
    </>
  );
};

export default FormBuilder;
