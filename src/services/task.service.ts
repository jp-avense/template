import { apiService } from "./api.service";

const ALL_TASKS_URL = "tasks";
const ALL_DETAILS_URL = "task-details";

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
};
