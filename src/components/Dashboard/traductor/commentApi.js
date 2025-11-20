import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const commentApi = createApi({
  reducerPath: 'commentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/api/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('userTokenLG');
      if (token) headers.set('authorization', `Token ${token}`);
      return headers;
    },
  }),
  tagTypes: ['TaskComments', 'Comment'],
  endpoints: (builder) => ({
    getTaskComments: builder.query({
      // args: { taskId, limit=10, offset=0, ordering='-created_at', window, parent }
      query: ({ taskId, limit = 10, offset = 0, ordering = '-created_at', window, parent }) => ({
        url: `tasks_by_id/${taskId}/comments/`,
        params: {
          limit,
          offset,
          ordering,
          ...(window ? { window } : {}),
          ...(parent ? { parent } : {}),
        },
      }),
      // cache por (taskId, ordering, window, parent) y merge por offset
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { taskId, ordering = '-created_at', window, parent } = queryArgs || {};
        return `${endpointName}-${taskId}-${ordering || ''}-${window || ''}-${parent || ''}`;
      },
      merge: (currentCache, newResp) => {
        if (!currentCache || !currentCache.results) {
          return Object.assign(currentCache || {}, newResp);
        }
        const seen = new Set(currentCache.results.map((i) => i.id));
        const merged = [...currentCache.results];
        (newResp.results || []).forEach((i) => {
          if (!seen.has(i.id)) merged.push(i);
        });
        currentCache.results = merged;
        currentCache.count = newResp.count;
        currentCache.next = newResp.next;
        currentCache.previous = newResp.previous;
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.offset !== previousArg?.offset ||
        currentArg?.limit !== previousArg?.limit,
      providesTags: (result, error, arg) => {
        const base = [{ type: 'TaskComments', id: arg.taskId }];
        if (!result?.results) return base;
        return [
          ...base,
          ...result.results.map((c) => ({ type: 'Comment', id: c.id })),
        ];
      },
    }),

    createComment: builder.mutation({
      query: ({ taskId, body }) => ({
        url: `tasks_by_id/${taskId}/comments/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (r, e, arg) => [{ type: 'TaskComments', id: arg.taskId }],
    }),

    toggleCommentLike: builder.mutation({
      query: ({ taskId, commentId }) => ({
        url: `tasks_by_id/${taskId}/comments/${commentId}/like/`,
        method: 'POST',
      }),
      invalidatesTags: (r, e, arg) => [
        { type: 'Comment', id: arg.commentId },
        { type: 'TaskComments', id: arg.taskId },
      ],
    }),

    deleteComment: builder.mutation({
      query: ({ taskId, commentId }) => ({
        url: `tasks_by_id/${taskId}/comments/${commentId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (r, e, arg) => [
        { type: 'Comment', id: arg.commentId },
        { type: 'TaskComments', id: arg.taskId },
      ],
    }),

    // opcional: si agregaste el endpoint backend
    getCommentLikes: builder.query({
      query: ({ taskId, commentId }) =>
        `tasks_by_id/${taskId}/comments/${commentId}/likes/`,
    }),
  }),
});

export const {
  useGetTaskCommentsQuery,
  useCreateCommentMutation,
  useToggleCommentLikeMutation,
  useDeleteCommentMutation,
  useLazyGetCommentLikesQuery,
} = commentApi;
