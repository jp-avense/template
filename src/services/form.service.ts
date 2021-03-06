import { apiService } from "./api.service";

const BASE_FIELD_URL = "form-fields";
const BASE_FORM_URL = "forms";
const BASE_S3_URL = "https://product-client-dev2.s3.eu-central-1.amazonaws.com";
const BASE_FILE_URL = "files";
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

  async bulkDeleteForms(ids: string[]) {
    return apiService.delete(`${BASE_FORM_URL}/bulk`, { data: ids });
  },

  async getImage(taskId: string, filename: string) {
    return apiService.post(`${BASE_FILE_URL}/pre-signed-download`, {
      filePath: `${BASE_S3_URL}/${taskId}/${filename}`,
    });
  },
};
