// src/components/Dashboard/traductor/feed/FeedApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const feedApi = createApi({
  reducerPath: "feedApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("userTokenLG");
      if (token) headers.set("Authorization", `Token ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    // =========================
    //        GET FEED
    // =========================
    getFeed: builder.query({
      /**
       * ordering: "-created_at" | "created_at" | "-likes_count" | "likes_count"
       * period: "day" | "week" | "month" | undefined
       * pch: "consejos" | "peticiones" | "historias" | undefined
       * media: "video" | "image" | undefined
       */
      query: ({
        limit = 3,
        offset = 0,
        ordering = "-created_at",
        period,
        pch,
        media,
      } = {}) => {
        const params = { limit, offset, ordering };
        if (period) params.period = period;
        if (pch) params.pch = pch;       // ✅ AÑADIDO
        if (media) params.media = media; // ✅ AÑADIDO

        return {
          url: "/feed/",
          params,
        };
      },

      transformResponse: (resp) => ({
        items: resp?.results ?? [],
        next: resp?.next ?? null,
        prev: resp?.previous ?? null,
        count: resp?.count ?? 0,
      }),

      providesTags: (result) =>
        result?.items?.length
          ? [
              ...result.items.map((it) => ({ type: "Task", id: it.id })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],

      // ✅ IMPORTANTE: la key del cache depende también de pch y media
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const {
          limit = 3,
          offset = 0,
          ordering = "-created_at",
          period = "",
          pch = "",
          media = "",
        } = queryArgs || {};

        return `${endpointName}-${limit}-${offset}-${ordering}-${period}-${pch}-${media}`;
      },
    }),

    // =========================
    //      CREATE TASK
    // =========================
    createTask: builder.mutation({
      query: ({ formData, pathId }) => ({
        url: `/tasks/${pathId}/`,
        method: "POST",
        body: formData,
      }),

      async onQueryStarted({ formData }, { dispatch, queryFulfilled }) {
        const tempId = `temp-${Date.now()}`;

        const optimistic = {
          id: tempId,
          title: formData.get("title") || "",
          description: formData.get("description") || "",
          pch: formData.get("pch") || "",
          username: formData.get("username") || "",
          categories: formData.get("categories") || "",
          like_set: [],
          likes_count: 0,
          subtasks: [],
          subfuentes: [],
          subfactores: [],
          user_image: null,
          shared_by_list: [],
          image: null,
          video: null,
          share_count: 0,
          created_at: new Date().toISOString(),
          user: null,
        };

        // Primera página del feed principal (como lo tenías)
        const baseArgs = {
          limit: 3,
          offset: 0,
          ordering: "-created_at",
          // period: undefined
          // pch/media: no los usamos aquí a propósito
        };

        const patch = dispatch(
          feedApi.util.updateQueryData("getFeed", baseArgs, (draft) => {
            if (!draft?.items) return;
            draft.items.unshift(optimistic);
            if (typeof draft.count === "number") draft.count += 1;
          })
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            feedApi.util.updateQueryData("getFeed", baseArgs, (draft) => {
              if (!draft?.items) return;
              const i = draft.items.findIndex((t) => t.id === tempId);
              if (i !== -1) draft.items[i] = data;
            })
          );
        } catch (e) {
          patch.undo();
        }
      },

      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
  }),
});

export const { useGetFeedQuery, useCreateTaskMutation } = feedApi;
