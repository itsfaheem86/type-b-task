import { api } from "@/app/api";
import type { CreateTodoInput, Todo, UpdateTodoInput } from "./types";

const LIST_TAG = { type: "Todo", id: "LIST" } as const;

const TEMP_ID_PREFIX = "temp-";

export const isTempId = (id: string) => id.startsWith(TEMP_ID_PREFIX);

export const todosApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTodos: build.query<Todo[], void>({
      query: () => "todos",
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: "Todo" as const, id: _id })), LIST_TAG]
          : [LIST_TAG],
    }),

    createTodo: build.mutation<Todo, CreateTodoInput>({
      query: (body) => ({ url: "todos", method: "POST", body }),
      async onQueryStarted(input, { dispatch, queryFulfilled }) {
        const tempId = `${TEMP_ID_PREFIX}${crypto.randomUUID()}`;
        const now = new Date().toISOString();

        const patch = dispatch(
          todosApi.util.updateQueryData("getTodos", undefined, (draft) => {
            draft.unshift({ ...input, _id: tempId, done: false, createdAt: now, updatedAt: now });
          }),
        );

        try {
          const { data: created } = await queryFulfilled;
          dispatch(
            todosApi.util.updateQueryData("getTodos", undefined, (draft) => {
              const index = draft.findIndex((todo) => todo._id === tempId);
              if (index !== -1) draft[index] = created;
            }),
          );
        } catch {
          patch.undo();
        }
      },
    }),

    updateTodo: build.mutation<Todo, UpdateTodoInput>({
      query: ({ id, ...body }) => ({ url: `todos/${id}`, method: "PUT", body }),
      async onQueryStarted({ id, ...changes }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          todosApi.util.updateQueryData("getTodos", undefined, (draft) => {
            const todo = draft.find((item) => item._id === id);
            if (todo) Object.assign(todo, changes);
          }),
        );

        try {
          const { data: updated } = await queryFulfilled;
          dispatch(
            todosApi.util.updateQueryData("getTodos", undefined, (draft) => {
              const index = draft.findIndex((item) => item._id === id);
              if (index !== -1) draft[index] = updated;
            }),
          );
        } catch {
          patch.undo();
        }
      },
    }),

    toggleTodo: build.mutation<Todo, string>({
      query: (id) => ({ url: `todos/${id}/done`, method: "PATCH" }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          todosApi.util.updateQueryData("getTodos", undefined, (draft) => {
            const todo = draft.find((item) => item._id === id);
            if (todo) todo.done = !todo.done;
          }),
        );

        try {
          const { data: toggled } = await queryFulfilled;
          dispatch(
            todosApi.util.updateQueryData("getTodos", undefined, (draft) => {
              const index = draft.findIndex((item) => item._id === id);
              if (index !== -1) draft[index] = toggled;
            }),
          );
        } catch {
          patch.undo();
        }
      },
    }),

    deleteTodo: build.mutation<void, string>({
      query: (id) => ({ url: `todos/${id}`, method: "DELETE" }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          todosApi.util.updateQueryData("getTodos", undefined, (draft) =>
            draft.filter((todo) => todo._id !== id),
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const {
  useGetTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useToggleTodoMutation,
  useDeleteTodoMutation,
} = todosApi;
