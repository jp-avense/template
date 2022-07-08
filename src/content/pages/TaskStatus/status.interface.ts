export class ITaskStatus {
  _id: string;

  Key: string;

  label: string;

  description?: string;

  isSystemStatus: boolean;

  systemStatusKey: TaskSystemStatus;

  state: TaskStatusState;

  order: number;
}

export enum TaskStatusState {
  DISABLED = "disabled",
  ENABLED = "enabled",
}
export enum TaskSystemStatus {
  NEW = "new",
  ASSIGNED = "assigned",
  DONE = "done",
  IN_PROGRESS = "inProgress",
}
