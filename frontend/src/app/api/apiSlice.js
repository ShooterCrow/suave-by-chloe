import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  setCredentials,
  clearCredentials,
} from "../../pages/authenticationPages/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    console.log(token);
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If 403 Forbidden (Access token expired)
  // AND we are not already trying to refresh (prevents infinite loop)
  if (result?.error?.status === 403 && args.url !== "/auth/refresh") {
    console.log("Access token expired, attempting refresh...");

    // Try to get a new token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult?.data) {
      console.log("Refresh successful, retrying original request.");
      // Store the new token + user data
      api.dispatch(setCredentials({ ...refreshResult.data }));
      // Retry the original query with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log("Refresh failed, clearing credentials.");
      api.dispatch(clearCredentials());
      // No hard reload here - let RequireAuth or PersistLogin handle it
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users", "Bookings", "Movies", "Settings"],
  endpoints: (builder) => ({}),
});
