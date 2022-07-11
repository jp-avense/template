import { AxiosError } from "axios";
import { TaskDefaultColumns } from "src/consts";

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
