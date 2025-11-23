// src/components/Dashboard/traductor/newforum/commentApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const commentApi = createApi({
  reducerPath: 'commentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('userTokenLG');
      if (token) headers.set('Authorization', `Token ${token}`);
      return headers;
    },
  }),
  tagTypes: ['TaskComments', 'Comment'],
  endpoints: (builder) => ({

    // LISTAR COMENTARIOS (paginado + filtros)
    // args: { taskId, limit=10, offset=0, ordering='-created_at', period, parent }
    getTaskComments: builder.query({
      query: ({ taskId, limit = 10, offset = 0, ordering = '-created_at', period, parent }) => ({
        url: `/tasks_by_id/${taskId}/comments/`,
        params: {
          limit,
          offset,
          ordering,
          ...(period ? { period } : {}),   // ✅ usa 'period' (day|week|month)
          ...(parent ? { parent } : {}),
        },
      }),

      // cache key por (taskId, ordering, period, parent)
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { taskId, ordering = '-created_at', period, parent } = queryArgs || {};
        return `${endpointName}-${taskId}-${ordering || ''}-${period || ''}-${parent || ''}`;
      },

      // merge para infinite scroll + refresco de primera página
      merge: (currentCache, newResp) => {
        if (!newResp) return;

        if (!currentCache || !currentCache.results) {
          Object.assign(currentCache || {}, newResp);
          return;
        }

        const newResults = newResp.results || [];
        const isFirstPage = !newResp.previous; // previous === null => offset 0

        if (isFirstPage) {
          const firstIds = new Set(newResults.map((i) => i.id));
          const resto = currentCache.results.filter((i) => !firstIds.has(i.id));
          currentCache.results = [...newResults, ...resto];
        } else {
          const byIdNew = new Map(newResults.map((i) => [i.id, i]));
          currentCache.results = currentCache.results.map((it) => byIdNew.get(it.id) || it);
          const existingIds = new Set(currentCache.results.map((i) => i.id));
          const toAppend = newResults.filter((i) => !existingIds.has(i.id));
          currentCache.results.push(...toAppend);
        }

        currentCache.count = newResp.count;
        currentCache.next = newResp.next;
        currentCache.previous = newResp.previous;
      },

      // refetch real cuando cambia paginación/filtros
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.offset !== previousArg?.offset ||
        currentArg?.limit !== previousArg?.limit ||
        currentArg?.ordering !== previousArg?.ordering ||
        currentArg?.period !== previousArg?.period,

      providesTags: (result, error, arg) => {
        const base = [{ type: 'TaskComments', id: arg.taskId }];
        if (!result?.results) return base;
        return [...base, ...result.results.map((c) => ({ type: 'Comment', id: c.id }))];
      },

      refetchOnFocus: true,
      refetchOnReconnect: true,
    }),

    // CREAR COMENTARIO
    createComment: builder.mutation({
      query: ({ taskId, body }) => ({
        url: `/tasks_by_id/${taskId}/comments/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (r, e, arg) => [{ type: 'TaskComments', id: arg.taskId }],
    }),

    // LIKE / UNLIKE COMENTARIO
    toggleCommentLike: builder.mutation({
      query: ({ taskId, commentId }) => ({
        url: `/tasks_by_id/${taskId}/comments/${commentId}/like/`,
        method: 'POST',
      }),
      invalidatesTags: (r, e, arg) => [
        { type: 'Comment', id: arg.commentId },
        { type: 'TaskComments', id: arg.taskId },
      ],
    }),

    // BORRAR COMENTARIO
    deleteComment: builder.mutation({
      query: ({ taskId, commentId }) => ({
        url: `/tasks_by_id/${taskId}/comments/${commentId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (r, e, arg) => [
        { type: 'Comment', id: arg.commentId },
        { type: 'TaskComments', id: arg.taskId },
      ],
    }),

    // ✅ NUEVO: LISTA DE USUARIOS QUE DIERON LIKE A UN COMENTARIO
    getCommentLikes: builder.query({
      query: ({ taskId, commentId }) =>
        `/tasks_by_id/${taskId}/comments/${commentId}/likes/`,
      providesTags: (r, e, arg) => [{ type: 'Comment', id: arg.commentId }],
    }),
  }),
});

export const {
  useGetTaskCommentsQuery,
  useCreateCommentMutation,
  useToggleCommentLikeMutation,
  useDeleteCommentMutation,
  useGetCommentLikesQuery,        // ✅
  useLazyGetCommentLikesQuery,    // ✅
} = commentApi;
