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
    getFeed: builder.query({
      query: ({ limit = 3, offset = 0 } = {}) =>
        `/feed/?limit=${limit}&offset=${offset}`,
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
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        `${endpointName}-${queryArgs?.limit ?? 3}-${queryArgs?.offset ?? 0}`,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }),

    // CREAR TAREA (optimista): POST a /tasks/  (SIN id en la URL)
    createTask: builder.mutation({
      query: ({ formData }) => ({
        url: '/tasks/',        // ✅ crear en la colección
        method: 'POST',
        body: formData,        // deja que el fetch ponga el boundary de multipart
      }),

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

        // Insertar optimista en la PRIMERA página (limit=3, offset=0)
        const patch = dispatch(
          feedApi.util.updateQueryData('getFeed', { limit: 3, offset: 0 }, (draft) => {
            draft.items.unshift(optimistic);
            if (typeof draft.count === 'number') draft.count += 1;
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            feedApi.util.updateQueryData('getFeed', { limit: 3, offset: 0 }, (draft) => {
              const i = draft.items.findIndex((t) => t.id === tempId);
              if (i !== -1) draft.items[i] = data;
            })
          );
        } catch (e) {
          const err = e?.error || e;
          console.error('createTask failed', err?.status, err?.data);
          patch.undo();
        }
      },
      // (opcional) por si quieres forzar refetch en otras páginas
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),
  }),
});

export const { useGetFeedQuery, useCreateTaskMutation } = feedApi;
