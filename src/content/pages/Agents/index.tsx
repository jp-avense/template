import { Helmet } from "react-helmet-async";

import { Grid, Container, Box, TextField, Card } from "@mui/material";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import AgentsHeader from "./AgentsHeader";
import { useTranslation } from "react-i18next";
import AgentInfo from "./AgentInfo";
import { TabsProvider } from "src/contexts/TabsContext";
import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { AgentContext, IAgent } from "src/contexts/AgentContext";
import _ from "lodash";
import { AuthContext } from "src/contexts/AuthContext";
import AgentsTable from "./AgentsTable";
import AgentFilter from "./AgentFilter";

const AgentsPage = () => {
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [deferredSearch, setDeferredSearch] = useState("");

  const context = useContext(AgentContext);
  const authContext = useContext(AuthContext);

  const {
    handleAgents: { agents, getAgents, filter },
    handleLoading: { setLoading },
  } = context;

  const {
    handleId: { idToken },
  } = authContext;

  useEffect(() => {
    getAgents();
  }, [idToken]);

  const debouncedSearch = useCallback(
    _.debounce((e: string) => {
      setDeferredSearch(e);
      setLoading(false);
    }, 800),
    []
  );

  const handleChange = (e) => {
    setLoading(true);
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const filteredAgents = useMemo(() => {
    if (deferredSearch === "" && filter === "none") return agents;
    let res = agents.slice();
    if (filter !== "none") {
      if (filter === "1" || filter === "0") {
        res = agents.filter((c) => c.status === parseInt(filter));
      } else {
        res = agents.filter((c) => c["custom:role"].includes(filter));
      }
    }

    return res.filter((x) => {
      const fullName = `${x.name} ${x.family_name}`;
      const { email, phone_number } = x;

      return [fullName, email, phone_number, x["custom:role"]].some((value) =>
        value.includes(deferredSearch)
      );
    });
  }, [deferredSearch, agents, filter]);

  return (
    <>
      <Helmet>
        <title>{t("users")}</title>
      </Helmet>
      <PageTitleWrapper>
        <AgentsHeader />
      </PageTitleWrapper>

      <Container maxWidth="xl">
        <Grid container justifyContent={"space-between"} xs={8}>
          <Grid item>
            <Box mb={2}>
              <TextField
                name="search"
                placeholder={t("search")}
                value={search}
                inputProps={{ style: { padding: ".9rem 1.2rem" } }}
                onChange={handleChange}
              />
            </Box>
          </Grid>
          <Grid item>
            <AgentFilter />
          </Grid>
        </Grid>
        <Grid container direction="row" alignItems="stretch" spacing={3}>
          <Grid item xs={8}>
            <Card>
              <AgentsTable agents={filteredAgents} />
            </Card>
          </Grid>
          <Grid item xs={4}>
            <AgentInfo />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default () => (
  <TabsProvider>
    <AgentsPage />
  </TabsProvider>
);
