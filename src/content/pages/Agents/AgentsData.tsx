import { useState } from "react";
import { Card } from "@mui/material";
import AgentsTable from "./AgentsTable";
import { useContext, useEffect } from "react";
import { AgentContext, IAgent } from "src/contexts/AgentContext";

function AgentsData() {
  const context = useContext(AgentContext);

  const {
    handleAgents: { agents, getAgents },
    handleLoading: { loading, setLoading }
  } = context;

  useEffect(() => {
    getAgents().finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <AgentsTable Agents={agents} loading={loading} />
    </Card>
  );
}

export default AgentsData;
