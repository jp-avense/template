import { AxiosError } from "axios";
import { cloneDeep } from "lodash";
import { TaskDefaultColumns } from "src/consts";
import {
  FormField,
  FormFieldExtended,
  InputTypeEnum,
} from "src/content/pages/FormFields/form-field.interface";

export const handleAxiosError = (error: AxiosError) => {
  if (error.response) {
    // @ts-ignore
    console.log(error.response.data.message);
  } else if (error.request) {
    console.log("Server did not respond to your request");
  } else {
    console.log(error);
    console.log("Unable to send request to server. Please try again later");
  }
};

export const getAxiosErrorMessage = (error: AxiosError) => {
  if (error.response) {
    // @ts-ignore
    return error.response.data?.message || "Bad request";
  } else if (error.request) {
    return "No response from server";
  } else {
    return "Request failed. Please try again later";
  }
};

export const parseValue = (value: string, type: string) => {
  let res: any = value;
  switch (type) {
    case "number":
      res = +value;
      break;
    case "date":
    case "datetime":
      res = new Date(value).toISOString();
      break;
    case "none":
      res = "null";
  }

  return res;
};

export const isDefaultColumn = (string: string) => {
  const defaults = Object.values(TaskDefaultColumns);

  return defaults.includes(string as TaskDefaultColumns);
};

export const toMap = (key: string, data: any[]) => {
  const d = cloneDeep(data);

  return d.reduce((acc, x) => {
    const mapKey = x[key];

    return {
      ...acc,
      [mapKey]: x,
    };
  }, {});
};

export const checkConditions = (currentValues, field: FormFieldExtended) => {
  const { conditions } = field;

  if (!conditions || Object.keys(conditions).length < 1) return true;

  return Object.entries(conditions).every(
    ([key, value]: [string, string[]]) => {
      const formValue: string | string[] = currentValues[key];

      return value.some((item) => {
        if (item === "!null") {
          return Array.isArray(formValue) ? formValue.length : formValue;
        } else {
          if (Array.isArray(formValue)) return formValue.includes(item);
          return formValue == item;
        }
      });
    }
  );
};
export const recursiveDisplay = (fields: any[], valueContainer) => {
  const allShownFields = fields.filter((item) =>
    checkConditions(valueContainer, item)
  );

  const newFieldsToShow = allShownFields.filter(
    (item) => !(item.key in valueContainer)
  );

  if (newFieldsToShow.length == 0) return valueContainer;

  for (const newField of newFieldsToShow) {
    const { defaultValue, key, inputType } = newField;

    let fallbackValue = inputType === InputTypeEnum.CHECKBOX ? [] : "";

    if (defaultValue == null || defaultValue == "") {
      valueContainer[key] = fallbackValue;
    } else {
      let resetValue = defaultValue;

      if (inputType === InputTypeEnum.CHECKBOX) {
        if (!Array.isArray(defaultValue)) resetValue = [defaultValue];
      }

      valueContainer[key] = resetValue;
    }
  }

  return recursiveDisplay(fields, valueContainer);
};

export const getDefaultValue = (field: FormField) => {
  const { inputType, defaultValue } = field;

  let fallbackValue = inputType === InputTypeEnum.CHECKBOX ? [] : "";

  if (defaultValue == "" || defaultValue == null) {
    return fallbackValue;
  }

  if (inputType === InputTypeEnum.CHECKBOX) {
    if (Array.isArray(defaultValue)) return defaultValue;

    return [defaultValue];
  }

  return defaultValue;
};
