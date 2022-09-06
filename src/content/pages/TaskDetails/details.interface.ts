export class ICreateDetails {
  key: string;

  label: string;

  description: string;

  order: number | null;

  inputType: string;

  showInTable: boolean;
}

export class IDetails extends ICreateDetails {
  _id: string;
}
