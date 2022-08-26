import { apiService } from "./api.service";

const BASE_URL = "history";

export const historyService = {
  async getTaskHistory(id: string) {
    return apiService.get(`${BASE_URL}/${id}`);
  },

  async getAllHistory(cancelToken?) {
    return cancelToken
      ? apiService.get(`${BASE_URL}`, { cancelToken: cancelToken.token })
      : apiService.get(`${BASE_URL}`);
  },
};
