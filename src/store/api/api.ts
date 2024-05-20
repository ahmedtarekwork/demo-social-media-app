import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// types
import { TComment, TPost, TUser } from "../../types";

type TGetPostsResponse = {
  meta: Record<string, unknown>;
  links: Record<string, unknown>;
  data: TPost[];
};

type SuccessAuthResponse = { user: TUser; token: string };

export type loginData = { username: string; password: string };

export const apiSlice = createApi({
  reducerPath: "tarmeezApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://tarmeezacademy.com/api/v1/" }),
  tagTypes: ["posts", "userPosts", "singlePost"],

  endpoints: (builder) => ({
    // posts \\
    getPosts: builder.query<TGetPostsResponse, number>({
      query: (page) => `posts?limit=15&page=${page}`,
      providesTags: ["posts"],
    }),

    getSinglePost: builder.query<{ data: TPost }, string>({
      providesTags: ["singlePost"],
      query: (postId) => ({
        url: `posts/${postId}`,
        headers: {
          Accept: "application/json",
        },
      }),
    }),

    makePost: builder.mutation<TPost, FormData>({
      query: (postData) => ({
        url: "posts",
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: postData,
      }),
      invalidatesTags: ["posts", "userPosts"],
    }),

    deletePost: builder.mutation<void, number>({
      query: (postId) => ({
        url: `posts/${postId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")?.toString()}`,
          Accept: "application/json",
        },
      }),
      invalidatesTags: ["posts", "userPosts"],
    }),

    editPost: builder.mutation<TPost, { postId: number; postData: FormData }>({
      invalidatesTags: ["posts", "userPosts"],
      query: ({ postId, postData }) => ({
        url: `posts/${postId}`,
        method: "POST",
        body: postData,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),

    // comments
    makeComment: builder.mutation<
      TComment,
      { postId: string | number; body: string }
    >({
      invalidatesTags: ["singlePost"],
      query: ({ postId, body }) => ({
        url: `posts/${postId}/comments`,
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: { body },
      }),
    }),

    // users \\
    getUser: builder.query<{ data: TUser }, string>({
      query: (userId) => ({
        url: `users/${userId}`,
        headers: {
          Accept: "application/json",
        },
      }),
    }),
    getUserPosts: builder.query<{ data: TPost[] }, string>({
      providesTags: ["userPosts"],
      query: (userId) => `users/${userId}/posts`,
      transformResponse: (res: { data: TPost[] }) => ({
        data: res.data.reverse(),
      }),
    }),

    // auth \\

    // resiter user
    registerUser: builder.mutation<SuccessAuthResponse, FormData>({
      query: (userData) => ({
        url: "register",
        method: "POST",
        body: userData,
        headers: {
          Accept: "application/json",
        },
      }),
    }),

    // login user
    loginUser: builder.mutation<SuccessAuthResponse, loginData>({
      query: (user) => ({
        url: "login",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: { username: user.username, password: user.password },
      }),
    }),
  }),
});

export const {
  getUserLazy,
  getUserPostsLazy,
  getSinglePostLazy,
  getPostsLazy,
} = {
  getUserLazy: apiSlice.useLazyGetUserQuery,
  getUserPostsLazy: apiSlice.useLazyGetUserPostsQuery,
  getSinglePostLazy: apiSlice.useLazyGetSinglePostQuery,
  getPostsLazy: apiSlice.useLazyGetPostsQuery,
};

export const {
  // posts \\

  // query
  useGetPostsQuery,

  // mutation
  useMakePostMutation,
  useDeletePostMutation,
  useEditPostMutation,

  // comment
  useMakeCommentMutation,

  // end posts \\

  // auth
  useRegisterUserMutation,
  useLoginUserMutation,
} = apiSlice;
