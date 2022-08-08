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
    getAgents: () => Promise<IAgent[]>;
    filter: string;
    setFilter: React.Dispatch<React.SetStateAction<string>>;
  };
  handleLoading: {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
  };
};

export const parseAgentResponse = (raw: any) => {
  const res: IAgent[] = raw.map((item) => {
    const init = {
      status: +item.Enabled,
    } as IAgent;

    return item.Attributes.reduce((acc, curr) => {
      acc[curr.Name] = curr.Value;
      return acc;
    }, init);
  });

  return res;
};

export const AgentContext = createContext<AgentContextT>({} as AgentContextT);

export const AgentProvider = ({ children }) => {
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("none");

  const getAgents = async () => {
    setLoading(true);
    try {
      const { data } = await agentService.getAgents();
      const res = parseAgentResponse(data);
      res.sort((a, b) => {
        const aName = `${a.name} ${a.family_name}`;
        const bName = `${b.name} ${b.family_name}`;

        return aName.localeCompare(bName);
      });
      setAgents(res);
      return res;
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgents = { agents, setAgents, getAgents, filter, setFilter };
  const handleLoading = { setLoading, loading };

  return (
    <AgentContext.Provider value={{ handleAgents, handleLoading }}>
      {children}
    </AgentContext.Provider>
  );
};
