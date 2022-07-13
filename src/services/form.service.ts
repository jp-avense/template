import { apiService } from "./api.service";

const BASE_URL = "form-fields";

export const formService = {
  async createField(values) {
    return apiService.post(BASE_URL, values);
  },

  async getFields() {
    return apiService.get(BASE_URL);
  },

  async bulkDeleteFormFields(ids: string[]) {
    return apiService.delete(`${BASE_URL}/bulk`, { data: ids });
  },

  async updateField(id, values) {
    return apiService.patch(`${BASE_URL}/${id}`, values)
  },
};
