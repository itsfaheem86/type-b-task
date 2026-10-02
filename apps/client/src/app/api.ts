import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

// Base API slice. Features add their endpoints with api.injectEndpoints().
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Todo"],
  endpoints: () => ({}),
});
