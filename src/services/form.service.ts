import { apiService } from "./api.service";

const BASE_FIELD_URL = "form-fields";
const BASE_FORM_URL = "forms";

export class SimpleFormField {
  key: string;

  conditions: {
    [key: string]: string[];
  };

  rules: {
    actions: string[];
    required: boolean;
  };
}
export class CreateFormDto {
  name: string;

  description: string;

  type: string;

  formFields: SimpleFormField[];
}

export const formService = {
  async createField(values) {
    return apiService.post(BASE_FIELD_URL, values);
  },

  async getFields() {
    return apiService.get(BASE_FIELD_URL);
  },

  async bulkDeleteFormFields(ids: string[]) {
    return apiService.delete(`${BASE_FIELD_URL}/bulk`, { data: ids });
  },

  async updateField(id, values) {
    return apiService.patch(`${BASE_FIELD_URL}/${id}`, values);
  },

  async getForms() {
    return apiService.get(`${BASE_FORM_URL}`);
  },

  async createForm(values: CreateFormDto) {
    return apiService.post(BASE_FORM_URL, values);
  },
};
