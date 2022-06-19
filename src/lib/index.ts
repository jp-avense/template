import { AxiosError } from "axios";

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
    return error.response.data.message;
  } else if (error.request) {
    return "no_response";
  } else {
    return "request_failed";
  }
};
