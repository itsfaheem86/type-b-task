import { PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { isTempId } from "../todosApi";
import type { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export function TodoItem({ todo, onEdit, onDelete }: TodoItemProps) {
  const isPending = isTempId(todo._id);

  return (
    <Item
      variant="outline"
      role="listitem"
      aria-busy={isPending || undefined}
      className={cn("transition-opacity", todo.done && "opacity-60", isPending && "animate-pulse")}
    >
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
