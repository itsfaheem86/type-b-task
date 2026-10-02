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
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Item, ItemContent, ItemGroup } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api-error";
import { useGetTodosQuery } from "../todosApi";
import { TodoItem } from "./TodoItem";

export function TodoList() {
  const { data: todos, isLoading, isError, error, refetch, isFetching } = useGetTodosQuery();

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
            <EmptyDescription>Add your first todo using the form.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      );
    }

    return (
      <ItemGroup>
        {todos.map((todo) => (
          <TodoItem key={todo._id} todo={todo} />
        ))}
      </ItemGroup>
    );
  }
}
