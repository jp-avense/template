import { Helmet } from "react-helmet-async";

import { Grid, Container } from "@mui/material";
import Footer from "src/components/Footer";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import AgentsHeader from "./AgentsHeader";
import AgentsData from "./AgentsData";

const AgentsPage = () => {
  return (
    <>
      <Helmet>
        <title>Agents</title>
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
