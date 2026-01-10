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

    // Update Settings (handles logo + gallery images)
    updateSettings: builder.mutation({
      query: (formData) => {
        // PROPER FORMDATA LOGGING IN API SLICE
        // console.log("=== API Slice: FormData Being Sent ===", formData);
        // for (let [key, value] of formData.entries()) {
        //   if (value instanceof File) {
        //     console.log(
        //       `${key}:`,
        //       `File(${value.name}, ${(value.size / 1024).toFixed(2)} KB, ${
        //         value.type
        //       })`
        //     );
        //   } else {
        //     console.log(`${key}:`, value);
        //   }
        // }
        // console.log("=== End API Slice FormData ===");

        return {
          url: "/settings",
          method: "PUT",
          body: formData, // FormData containing: logo (single), gallery (multiple), and other fields
        };
      },
      invalidatesTags: [{ type: "Settings", id: "LIST" }],
    }),

    // Delete Gallery Image
    deleteGalleryImage: builder.mutation({
      query: (publicId) => ({
        url: `/settings/gallery/${publicId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Settings", id: "LIST" }],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useDeleteGalleryImageMutation,
} = settingsApiSlice;

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

// import { apiSlice } from "../../app/api/apiSlice";

// export const settingsApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getSettings: builder.query({
//       query: () => "/settings",
//       providesTags: ["Settings"],
//       transformResponse: (response) => response.data,
//     }),

//     updateSettings: builder.mutation({
//       query: ({ formData }) => ({
//         url: `/settings`,
//         method: "PUT",
//         body: formData,
//       }),
//       invalidatesTags: ["Settings"],
//     }),

//     // updateSettings: builder.mutation({
//     //   query: ({ hotelInfo, logo, gallery }) => {
//     //     // Create FormData for file uploads
//     //     const formData = new FormData();

//     //     // Add hotelInfo as JSON string if it exists
//     //     if (hotelInfo) {
//     //       formData.append("hotelInfo", JSON.stringify(hotelInfo));
//     //     }

//     //     // Add logo file if provided
//     //     if (logo) {
//     //       formData.append("logo", logo);
//     //     }

//     //     // Add gallery files if provided
//     //     if (gallery && gallery.length > 0) {
//     //       gallery.forEach((file, index) => {
//     //         formData.append("gallery", file);
//     //       });
//     //     }

//     //     return {
//     //       url: "/settings",
//     //       method: "PUT",
//     //       body: formData,
//     //     };
//     //   },
//     //   invalidatesTags: ["Settings"],
//     // }),

//     deleteGalleryImage: builder.mutation({
//       query: (publicId) => ({
//         url: `/settings/gallery/${publicId}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Settings"],
//     }),
//   }),
// });

// export const {
//   useGetSettingsQuery,
//   useUpdateSettingsMutation,
//   useDeleteGalleryImageMutation,
// } = settingsApiSlice;
