import { apiService } from "./api.service";

const ALL_URL = "agents";
const CHANGE_STATUS_URL = "agents/change-status";

export const agentService = {
  async getAgents() {
    return apiService.get(ALL_URL);
  },

  async changeStatus(agents: string[], status: "enable" | "disable") {
    return apiService.post(CHANGE_STATUS_URL, { status, agents });
  },
};
