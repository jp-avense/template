import { createContext, useState, useEffect } from "react";
import { handleAxiosError } from "src/lib";
import { agentService } from "src/services/agent.service";
import { apiService } from "src/services/api.service";
import { authService } from "src/services/auth.service";

export interface IAgent {
  sub: string;
  email_verified: boolean;
  phone_number_verified: boolean;
  "custom:group": string;
  preferred_username: string;
  locale: string;
  "custom:tenant": string;
  phone_number: string;
  family_name: string;
  "custom:role": string;
  email: string;
  name: string;
  status: 0 | 1;
}

type AgentContextT = {
  handleAgents: {
    agents: IAgent[];
    setAgents: React.Dispatch<React.SetStateAction<IAgent[]>>;
    getAgents: () => Promise<void>;
  };
  handleLoading: {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
  };
};

export const AgentContext = createContext<AgentContextT>({} as AgentContextT);

export const AgentProvider = ({ children }) => {
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getAgents = async () => {
    setLoading(true);
    agentService
      .getAgents()
      .then(({ data }) => {
        const res = data.map((item) => {
          const init = {
            status: +item.Enabled,
          } as IAgent;

          return item.Attributes.reduce((acc, curr) => {
            acc[curr.Name] = curr.Value;
            return acc;
          }, init);
        });

        setAgents(res);
      })
      .catch(handleAxiosError)
      .finally(() => setLoading(false));
  };

  const handleAgents = { agents, setAgents, getAgents };
  const handleLoading = { setLoading, loading };

  return (
    <AgentContext.Provider value={{ handleAgents, handleLoading }}>
      {children}
    </AgentContext.Provider>
  );
};
