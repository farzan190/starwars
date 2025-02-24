import { initClient } from "@ts-rest/core";
import { starshipContract } from "./apiContract";

const BASE_URL = "https://swapi.dev/api";

export const apiClient = initClient(starshipContract, {
  baseUrl: BASE_URL,
  baseHeaders: {},
});
