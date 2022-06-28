import { Helmet } from "react-helmet-async";

import { Grid, Container } from "@mui/material";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import AgentsHeader from "./AgentsHeader";
import AgentsData from "./AgentsData";
import { useTranslation } from "react-i18next";

const AgentsPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t("agents")}</title>
      </Helmet>
      <PageTitleWrapper>
        <AgentsHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <AgentsData />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AgentsPage;
