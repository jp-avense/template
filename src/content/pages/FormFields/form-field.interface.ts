export class FormField {
  _id: string;

  key: string;

  inputType: InputTypeEnum;

  note?: string;

  validation?: string;

  label?: string;

  description?: string;

  placeholder?: string;

  options?: FieldOptions;

  defaultValue?: any;

  rows?: number;
}

export class FormFieldExtended extends FormField {
  conditions?: {
    [key: string]: any;
  };

  rules?: {
    required: boolean;
    actions?: string[];
  };

  value?: any;

  displayValue?: any
}

export class FieldOptions {
  [key: string]: any;
}

export enum InputTypeEnum {
  TEXT = "text",
  TEXTAREA = "textarea",
  MARKUP = "markup",
  ATTACH_BUTTON = "attachButton",
  CAMERA_BUTTON = "cameraButton",
  RADIO = "radios",
  CHECKBOX = "checkboxes",
  DROPDOWN = "dropdown",
  BUTTON = "button",
  DATE_TIME_PICKER = "dateTimePicker",
  DATE_TIME_BUTTON = "dateTimeRegister",
  SIGNATURE = "signature",
  GEO = "geo",
  PRINT_BUTTON = "printButton",
}
