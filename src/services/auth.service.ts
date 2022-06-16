import { ApiService } from "./api.service";

export class AuthService extends ApiService {
  private LOGIN_URL = "auth/login";

  private REFRESH_URL = "auth/refresh";

  private LOGOUT_URL = "auth/logout";

  private USER_URL = "auth/user";

  async login(username: string, password: string) {
    return this.axios.post(this.LOGIN_URL, { username, password });
  }
}
