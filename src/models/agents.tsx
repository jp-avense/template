export type AgentStatus = 'active' | 'disabled' | 'pending';

export interface Agents {
  id: string,
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userName: string;
  emailAddress: string;
  status: AgentStatus;
}
