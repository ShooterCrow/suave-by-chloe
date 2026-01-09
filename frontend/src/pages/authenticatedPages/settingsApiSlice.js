import { apiSlice } from "../../app/api/apiSlice";

export const settingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => "/settings",
      providesTags: ["Settings"],
      transformResponse: (response) => response.data,
    }),
    updateSettings: builder.mutation({
      query: (settings) => ({
        url: "/settings",
        method: "PUT",
        body: settings,
      }),
      invalidatesTags: ["Settings"],
    }),
    uploadLogo: builder.mutation({
      query: (formData) => ({
        url: "/settings/upload-logo",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Settings"],
    }),
    uploadGalleryImages: builder.mutation({
      query: (formData) => ({
        url: "/settings/gallery",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Settings"],
    }),
    deleteGalleryImage: builder.mutation({
      query: (publicId) => ({
        url: `/settings/gallery/${publicId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useUploadLogoMutation,
  useUploadGalleryImagesMutation,
  useDeleteGalleryImageMutation,
} = settingsApiSlice;
