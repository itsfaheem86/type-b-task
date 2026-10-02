export interface Todo {
  _id: string;
  title: string;
  description?: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiErrorBody {
  message: string;
  errors?: { field: string; message: string }[];
}

export interface CreateTodoInput {
  title: string;
  description?: string;
}
