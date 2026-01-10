import { apiSlice } from "../../app/api/apiSlice";

export const settingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => "/settings",
      providesTags: ["Settings"],
      transformResponse: (response) => response.data,
    }),

    updateSettings: builder.mutation({
      query: ({ hotelInfo, logo, gallery }) => {
        // Create FormData for file uploads
        const formData = new FormData();

        // Add hotelInfo as JSON string if it exists
        if (hotelInfo) {
          formData.append("hotelInfo", JSON.stringify(hotelInfo));
        }

        // Add logo file if provided
        if (logo) {
          formData.append("logo", logo);
        }

        // Add gallery files if provided
        if (gallery && gallery.length > 0) {
          gallery.forEach((file, index) => {
            formData.append("gallery", file);
          });
        }

        return {
          url: "/settings",
          method: "PUT",
          body: formData,
        };
      },
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
  useDeleteGalleryImageMutation,
} = settingsApiSlice;
