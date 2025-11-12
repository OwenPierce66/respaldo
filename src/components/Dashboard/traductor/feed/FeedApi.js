// src/components/Dashboard/traductor/feed/FeedApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const feedApi = createApi({
  reducerPath: 'feedApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('userTokenLG');
      if (token) headers.set('Authorization', `Token ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({

    // =========================
    //        GET FEED
    // =========================
    getFeed: builder.query({
      // ahora acepta ordering y period además de limit/offset
      // ordering: "-created_at" | "created_at" | "-likes_count" | "likes_count"
      // period: "day" | "week" | "month" | undefined
      query: ({ limit = 3, offset = 0, ordering = '-created_at', period } = {}) => {
        const params = { limit, offset, ordering };
        if (period) params.period = period;   // solo lo mando si viene

        return {
          url: '/feed/',
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
              ...result.items.map((it) => ({ type: 'Task', id: it.id })),
              { type: 'Task', id: 'LIST' },
            ]
          : [{ type: 'Task', id: 'LIST' }],

      // la key del cache ahora depende también de ordering y period
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const {
          limit = 3,
          offset = 0,
          ordering = '-created_at',
          period = '',
        } = queryArgs || {};

        return `${endpointName}-${limit}-${offset}-${ordering}-${period}`;
      },

      refetchOnFocus: true,
      refetchOnReconnect: true,
    }),

    // =========================
    //      CREATE TASK
    // =========================
    // ⚠️ Back compat: crear con POST a /tasks/:pathId/
    createTask: builder.mutation({
      // pasamos pathId dinámicamente
      query: ({ formData, pathId }) => ({
        url: `/tasks/${pathId}/`,
        method: 'POST',
        body: formData,
      }),

      // optimistic update sobre la PRIMERA página del feed principal
      async onQueryStarted({ formData }, { dispatch, queryFulfilled }) {
        const tempId = `temp-${Date.now()}`;

        const optimistic = {
          id: tempId,
          title: formData.get('title') || '',
          description: formData.get('description') || '',
          pch: formData.get('pch') || '',
          username: formData.get('username') || '',
          categories: formData.get('categories') || '',
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

        // esta es la queryArgs de la primera página del feed principal
        const baseArgs = {
          limit: 3,
          offset: 0,
          ordering: '-created_at',
          // period: undefined
        };

        // 1) insertar optimista al inicio
        const patch = dispatch(
          feedApi.util.updateQueryData('getFeed', baseArgs, (draft) => {
            if (!draft?.items) return;
            draft.items.unshift(optimistic);
            if (typeof draft.count === 'number') draft.count += 1;
          })
        );

        try {
          // 2) esperar respuesta real del backend
          const { data } = await queryFulfilled;

          // 3) reemplazar el temp por la tarea real
          dispatch(
            feedApi.util.updateQueryData('getFeed', baseArgs, (draft) => {
              if (!draft?.items) return;
              const i = draft.items.findIndex((t) => t.id === tempId);
              if (i !== -1) draft.items[i] = data;
            })
          );
        } catch (e) {
          // si falla la petición, deshacemos el optimista
          patch.undo();
        }
      },

      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),
  }),
});

export const { useGetFeedQuery, useCreateTaskMutation } = feedApi;
