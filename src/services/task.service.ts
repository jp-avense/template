import { apiService } from "./api.service";

const TASK_URL = "tasks";
const DETAILS_URL = "task-details";
const TASK_STATUS_URL = "task-statuses";
const TASK_TYPE_URL = "task-types";

interface IFilterParam {
  [key: string]: any;
}

export const taskService = {
  async getAll(filters: IFilterParam = {}) {
    const finalFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value != null) {
        acc[key] = value;
      }

      return acc;
    }, {});

    const params = new URLSearchParams(finalFilters).toString();
    const url = `${TASK_URL}?${params}`;

    return apiService.get(url);
  },

  async getDetails() {
    return apiService.get(DETAILS_URL);
  },

  async assign({ taskIds, agent, admin }) {
    return apiService.post(`${TASK_URL}/assign`, {
      taskIds: taskIds,
      agentSub: agent,
      adminSub: admin,
    });
  },

  async getStatuses() {
    return apiService.get(TASK_STATUS_URL);
  },

  async getTypes() {
    return apiService.get(TASK_TYPE_URL);
  },

  async createTaskStatus(values) {
    return apiService.post(TASK_STATUS_URL, values);
  },

  async updateStatus(id: string, values) {
    return apiService.patch(`${TASK_STATUS_URL}/${id}`, values);
  },
};
