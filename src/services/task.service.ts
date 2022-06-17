import { apiService } from "./api.service";

const GET_ALL_URL = "tasks";


export const taskService = {
  async getAll(page = 0, pageSize = 10) {
    const data = {
      page,
      pageSize,
    };

    // @ts-ignore
    const params = new URLSearchParams(data).toString();
    const url = `${GET_ALL_URL}?${params}`;

    return apiService.get(url);
  },
};


