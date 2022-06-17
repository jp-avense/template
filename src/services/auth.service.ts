import { apiService } from "./api.service";

const LOGIN_URL = "auth/login";

const REFRESH_URL = "auth/refresh";

const LOGOUT_URL = "auth/logout";

const USER_URL = "auth/user";

export const authService = {
  async login(username: string, password: string) {
    return apiService.post(LOGIN_URL, { username, password });
  },
  async refresh(token: string) {
    return apiService.get(REFRESH_URL, {
      headers: {
        "x-refresh-token": token,
      },
    });
  },

  async logout(token: string) {
    return apiService.get(LOGOUT_URL, {
      headers: {
        "x-refresh-token": token,
      },
    });
  },

  async getUser() {
    return apiService.get(USER_URL);
  },
};
