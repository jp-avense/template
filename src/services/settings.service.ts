import { apiService } from "./api.service";

const SETTINGS_URL = "settings";

export const settingsService = {
  async getAll() {
    return apiService.get(SETTINGS_URL);
  },

  async addSetting(values) {
    return apiService.post(SETTINGS_URL, values);
  },
};
