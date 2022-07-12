import { Container, Grid } from "@mui/material";
import { t } from "i18next";
import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "src/components/PageTitleWrapper";

import FormFieldHeader from "./FormFieldsHeader";

const FormFields = () => {
  return (
    <>
      <Helmet>
        <title>{t("Form fields")}</title>
      </Helmet>
      <PageTitleWrapper>
        <FormFieldHeader />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <Grid container direction="row" alignItems="stretch" spacing={3}>
          <Grid item></Grid>
        </Grid>
      </Container>
    </>
  );
};

export default FormFields;
