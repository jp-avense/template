import { apiService } from "./api.service";

const ALL_TASKS_URL = "tasks";
const ALL_DETAILS_URL = "task-details";
const ASSIGN_URL = "tasks";
interface IFilterParam {
  [key: string]: any;
}

export const taskService = {
  async getAll(filters: IFilterParam = {}) {
    const params = new URLSearchParams(filters).toString();
    const url = `${ALL_TASKS_URL}?${params}`;

    return apiService.get(url);
  },

  async getDetails() {
    return apiService.get(ALL_DETAILS_URL);
  },

  async assign({ taskId, agent, admin, executionDate }) {
    return apiService.post(`tasks/${taskId}/assign`, {
      agentSub: agent,
      adminSub: admin,
      executionDate
    });
  },
};
