export const API_ENDPOINT =
  process.env.REACT_APP_HOST ?? "http://localhost:8000/api";

export const HEADERS = {
  Accept: "application/json",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  "Content-Type": "application/json",
};
