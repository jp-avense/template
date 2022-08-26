import {
  FormField,
  FormFieldExtended,
} from "../FormFields/form-field.interface";

export class Form {
  _id: string;

  name: string;

  type: string;

  description: string;

  formFields: FormFieldExtended[];

  formType: "create" | "execute";
}
