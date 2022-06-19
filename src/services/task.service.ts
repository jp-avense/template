import { apiService } from "./api.service";

const ALL_TASKS_URL = "tasks";
const ALL_DETAILS_URL = "task-details";

export const taskService = {
  async getAll(page = 0, pageSize = 10) {
    const data = {
      page,
      pageSize,
    };

    // @ts-ignore
    const params = new URLSearchParams(data).toString();
    const url = `${ALL_TASKS_URL}?${params}`;

    return apiService.get(url);
  },

  async getDetails() {
    return apiService.get(ALL_DETAILS_URL);
  },
};
