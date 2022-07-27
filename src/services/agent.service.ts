import { apiService } from "./api.service";

const ALL_URL = "agents";
const CHANGE_STATUS_URL = "agents/change-status";
const REGISTER_URL = "agents";

export enum UserRoles {
  admin = "admin",
  backoffice = "backoffice",
  agent = "agent",
  manager = "manager",
  guest = "guest",
}
export interface RegisterDto {
  email: string;
  password: string;
  roles: string[];
  name: string;
  familyName: string;
  phoneNumber: string;
}

export interface UpdateDto {
  email: string;
  originalEmail: string;
  role: string[];
  name: string;
  familyName: string;
  phoneNumber: string;
  password: string;
}

export const agentService = {
  async getAgents() {
    return apiService.get(ALL_URL);
  },

  async changeStatus(agents: string[], status: "enable" | "disable") {
    return apiService.post(CHANGE_STATUS_URL, { status, agents });
  },

  async register(values: RegisterDto) {
    return apiService.post(REGISTER_URL, values);
  },

  async update(sub: string, values: UpdateDto) {
    return apiService.patch(`${ALL_URL}/${sub}`, values);
  },
};
