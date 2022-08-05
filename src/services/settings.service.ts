import { apiService } from "./api.service";

const SETTINGS_URL = "settings";

const UPDATE_URL = "settings/update-settings";

export const settingsService = {
  async getAll() {
    return apiService.get(SETTINGS_URL);
  },

  async addSetting(values) {
    return apiService.post(SETTINGS_URL, values);
  },

  async updateSettings(values) {
    return apiService.patch(UPDATE_URL, values);
  },

  async bulkDeleteAppSettings(ids: string[]) {
    return apiService.delete("bulk", { data: ids });
  },
};
