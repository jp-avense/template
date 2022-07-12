import { apiService } from "./api.service";

const BASE_URL = "form-fields";

export const formService = {
  async createField(values) {
    return apiService.post(BASE_URL, values);
  },
};
