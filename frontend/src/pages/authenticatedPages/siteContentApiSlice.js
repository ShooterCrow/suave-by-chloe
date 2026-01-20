import { apiSlice } from "../../app/api/apiSlice";

export const siteContentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSiteContent: builder.query({
      query: () => ({
        url: "/site-content",
        method: "GET",
      }),
      providesTags: ["SiteContent"],
    }),

    updateHomePage: builder.mutation({
      query: (formData) => ({
        url: "/site-content/homepage",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["SiteContent"],
    }),
    updateGallery: builder.mutation({
      query: (formData) => ({
        url: "/site-content/gallery",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["SiteContent"],
    }),
    updateOffers: builder.mutation({
      query: (data) => ({
        url: "/site-content/offers",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["SiteContent"],
    }),
    updateBlog: builder.mutation({
      query: (data) => ({
        url: "/site-content/blogs",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["SiteContent"],
    }),
    updateMediaLibrary: builder.mutation({
      query: (formData) => ({
        url: "/site-content/media-library",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["SiteContent"],
    }),
    deleteMediaImage: builder.mutation({
      query: (publicId) => ({
        url: `/site-content/media/${publicId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SiteContent"],
    }),
  }),
});

export const {
  useGetSiteContentQuery,
  useUpdateHomePageMutation,
  useUpdateGalleryMutation,
  useUpdateOffersMutation,
  useUpdateBlogMutation,
  useUpdateMediaLibraryMutation,
  useDeleteMediaImageMutation,
} = siteContentApiSlice;
