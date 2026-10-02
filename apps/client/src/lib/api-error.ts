import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { ApiErrorBody } from "@/features/todos/types";

function isApiErrorBody(data: unknown): data is ApiErrorBody {
  return (
    typeof data === "object" && data !== null && typeof (data as ApiErrorBody).message === "string"
  );
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}

export function getErrorMessage(error: unknown): string {
  if (isFetchBaseQueryError(error)) {
    if (error.status === "FETCH_ERROR") {
      return "Can't reach the server. Check that the API is running.";
    }
    if (isApiErrorBody(error.data)) {
      const fieldMessages = error.data.errors?.map((fieldError) => fieldError.message);
      return fieldMessages?.length ? fieldMessages.join(". ") : error.data.message;
    }
    return typeof error.status === "number"
      ? `Request failed with status ${error.status}`
      : "Something went wrong";
  }

  if (error instanceof Error || isApiErrorBody(error)) return error.message;

  return "Something went wrong";
}
