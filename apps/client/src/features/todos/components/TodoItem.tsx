import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { isTempId } from "../todosApi";
import type { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
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
    </Item>
  );
}
