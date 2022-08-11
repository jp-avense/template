import { apiService } from "./api.service";

const BASE_URL = "history";

export const historyService = {
  async getTaskHistory(id: string) {
    return apiService.get(`${BASE_URL}/${id}`);
  },
};
