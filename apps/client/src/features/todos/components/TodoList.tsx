import { useState } from "react";
import { CircleAlertIcon, ListTodoIcon, RotateCwIcon } from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Item, ItemContent, ItemGroup } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api-error";
import { useGetTodosQuery } from "../todosApi";
import type { Todo } from "../types";
import { DeleteTodoDialog } from "./DeleteTodoDialog";
import { NewTodoButton } from "./NewTodoButton";
import { TodoDialog } from "./TodoDialog";
import { TodoItem } from "./TodoItem";

export function TodoList() {
  const { data: todos, isLoading, isError, error, refetch, isFetching } = useGetTodosQuery();
  const [todoToEdit, setTodoToEdit] = useState<Todo | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  function openEdit(todo: Todo) {
    setTodoToEdit(todo);
    setIsEditOpen(true);
  }

  function confirmDelete(todo: Todo) {
    setTodoToDelete(todo);
    setIsDeleteOpen(true);
  }

  const remaining = todos?.filter((todo) => !todo.done).length ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your todos</CardTitle>
        <CardDescription>Everything on your list, newest first.</CardDescription>
        {todos && todos.length > 0 && (
          <CardAction>
            <Badge variant="secondary">{remaining} remaining</Badge>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
      {todoToEdit && (
        <TodoDialog todo={todoToEdit} open={isEditOpen} onOpenChange={setIsEditOpen} />
      )}
      <DeleteTodoDialog todo={todoToDelete} open={isDeleteOpen} onOpenChange={setIsDeleteOpen} />
    </Card>
  );

  function renderContent() {
    if (isLoading) {
      return (
        <ItemGroup aria-busy="true" aria-label="Loading todos">
          {Array.from({ length: 3 }, (_, i) => (
            <Item key={i} variant="outline" role="listitem">
              <ItemContent className="gap-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      );
    }

    if (isError) {
      return (
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>Couldn't load todos</AlertTitle>
          <AlertDescription>{getErrorMessage(error)}</AlertDescription>
          <AlertAction>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              <RotateCwIcon className={isFetching ? "animate-spin" : undefined} />
              Retry
            </Button>
          </AlertAction>
        </Alert>
      );
    }

    if (!todos?.length) {
      return (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ListTodoIcon />
            </EmptyMedia>
            <EmptyTitle>No todos yet</EmptyTitle>
            <EmptyDescription>Create your first todo to get started.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <NewTodoButton />
          </EmptyContent>
        </Empty>
      );
    }

    return (
      <ItemGroup>
        {todos.map((todo) => (
          <TodoItem key={todo._id} todo={todo} onEdit={openEdit} onDelete={confirmDelete} />
        ))}
      </ItemGroup>
    );
  }
}
