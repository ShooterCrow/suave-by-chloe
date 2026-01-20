import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const settingsAdapter = createEntityAdapter({});

const initialState = settingsAdapter.getInitialState();

export const settingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get Settings
    getSettings: builder.query({
      query: () => "/settings",
      providesTags: ["Settings"],
      transformResponse: (response) => response.data,
    }),

    // Update Settings (handles logo)
    updateSettings: builder.mutation({
      query: (formData) => ({
        url: "/settings",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: [{ type: "Settings", id: "LIST" }],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } =
  settingsApiSlice;

// Selectors
export const selectSettingsResult =
  settingsApiSlice.endpoints.getSettings.select();

const selectSettingsData = createSelector(
  selectSettingsResult,
  (settingsResult) => settingsResult.data
);

export const {
  selectAll: selectAllSettings,
  selectById: selectSettingsById,
  selectIds: selectSettingsIds,
} = settingsAdapter.getSelectors(
  (state) => selectSettingsData(state) ?? initialState
);
