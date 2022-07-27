import { Helmet } from "react-helmet-async";

import { Grid, Container } from "@mui/material";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import AgentsHeader from "./AgentsHeader";
import AgentsData from "./AgentsData";
import { useTranslation } from "react-i18next";
import AgentInfo from "./AgentInfo";
import { TabsProvider } from "src/contexts/TabsContext";

const AgentsPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <TabsProvider>
        <Helmet>
          <title>{t("users")}</title>
        </Helmet>
        <PageTitleWrapper>
          <AgentsHeader />
        </PageTitleWrapper>
        <Container maxWidth="xl">
          <Grid container direction="row" alignItems="stretch" spacing={3}>
            <Grid item xs={8}>
              <AgentsData />
            </Grid>
            <Grid item xs={4}>
              <AgentInfo />
            </Grid>
          </Grid>
        </Container>
      </TabsProvider>
    </>
  );
};

export default AgentsPage;
