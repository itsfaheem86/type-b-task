import { PencilIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { getErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import { isTempId, useToggleTodoMutation } from "../todosApi";
import type { Todo } from "../types";

const createdAtFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export function TodoItem({ todo, onEdit, onDelete }: TodoItemProps) {
  const isPending = isTempId(todo._id);
  const [toggleTodo, { isLoading: isToggling }] = useToggleTodoMutation();

  async function handleToggle() {
    try {
      await toggleTodo(todo._id).unwrap();
    } catch (error) {
      toast.error("Couldn't update todo", { description: getErrorMessage(error) });
    }
  }

  return (
    <Item
      variant="outline"
      role="listitem"
      aria-busy={isPending || undefined}
      className={cn("transition-opacity", todo.done && "opacity-60", isPending && "animate-pulse")}
    >
      <ItemMedia className="self-start pt-0.5">
        <Checkbox
          checked={todo.done}
          onCheckedChange={handleToggle}
          disabled={isPending || isToggling}
          aria-label={
            todo.done ? `Mark "${todo.title}" as not done` : `Mark "${todo.title}" as done`
          }
        />
      </ItemMedia>
      <ItemContent className="min-w-0">
        <ItemTitle
          className={cn(
            "line-clamp-none w-full break-words",
            todo.done && "text-muted-foreground line-through",
          )}
        >
          {todo.title}
        </ItemTitle>
        {todo.description && (
          <ItemDescription className={cn("whitespace-pre-line", todo.done && "line-through")}>
            {todo.description}
          </ItemDescription>
        )}
        <p className="text-xs text-muted-foreground">
          Created{" "}
          <time dateTime={todo.createdAt}>{createdAtFormat.format(new Date(todo.createdAt))}</time>
        </p>
      </ItemContent>
      <ItemActions>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Edit "${todo.title}"`}
          aria-haspopup="dialog"
          disabled={isPending}
          onClick={() => onEdit(todo)}
        >
          <PencilIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete "${todo.title}"`}
          aria-haspopup="dialog"
          disabled={isPending}
          onClick={() => onDelete(todo)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2Icon />
        </Button>
      </ItemActions>
    </Item>
  );
}
