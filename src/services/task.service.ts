import { TaskStatusState } from "src/content/pages/TaskStatus/status.interface";
import { apiService } from "./api.service";

const TASK_URL = "tasks";
const DETAILS_URL = "task-details";
const TASK_STATUS_URL = "task-statuses";
const TASK_TYPE_URL = "task-types";

interface IFilterParam {
  [key: string]: any;
}

export const taskService = {
  async getAll(filters: IFilterParam = {}, cancelToken?) {
    const finalFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value != null) {
        acc[key] = value;
      }

      return acc;
    }, {});

    const params = new URLSearchParams(finalFilters).toString();
    const url = `${TASK_URL}?${params}`;

    return cancelToken
      ? apiService.get(url, { cancelToken: cancelToken.token })
      : apiService.get(url);
  },

  async getAllTask() {
    return apiService.get(TASK_URL);
  },

  async getDetails() {
    return apiService.get(DETAILS_URL);
  },

  async assign({ taskIds, agent, admin, assignDate }) {
    return apiService.post(`${TASK_URL}/assign`, {
      taskIds: taskIds,
      agentSub: agent,
      adminSub: admin,
      assignDate,
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

  async disableStatus(ids: string[]) {
    return apiService.delete(`${TASK_STATUS_URL}`, { data: { ids } });
  },

  async changeState(ids: string[], newState: TaskStatusState) {
    return apiService.patch(`${TASK_STATUS_URL}/bulk`, {
      ids,
      state: newState,
    });
  },

  async bulkChangeStatusOrder(data: { id: string; newOrder: number }[]) {
    return apiService.patch(`${TASK_STATUS_URL}/bulk/order`, data);
  },

  async createTaskTypes(values) {
    return apiService.post(TASK_TYPE_URL, values);
  },

  async getTaskTypes() {
    return apiService.get(TASK_TYPE_URL);
  },

  async updateTaskType(id: string, values) {
    return apiService.patch(`${TASK_TYPE_URL}/${id}`, values);
  },

  async bulkDeleteStatus(ids: string[]) {
    return apiService.delete(`${TASK_STATUS_URL}/bulk`, { data: ids });
  },

  async bulkDeleteType(ids: string[]) {
    return apiService.delete(`${TASK_TYPE_URL}/bulk`, { data: ids });
  },

  async updateTask(id: string, taskObject) {
    return apiService.put(`${TASK_URL}/${id}`, taskObject);
  },
};
