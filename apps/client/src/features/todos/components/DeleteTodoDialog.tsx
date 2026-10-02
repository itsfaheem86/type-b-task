import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getErrorMessage } from "@/lib/api-error";
import { useDeleteTodoMutation } from "../todosApi";
import type { Todo } from "../types";

interface DeleteTodoDialogProps {
  todo: Todo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTodoDialog({ todo, open, onOpenChange }: DeleteTodoDialogProps) {
  const [deleteTodo] = useDeleteTodoMutation();

  async function handleDelete() {
    if (!todo) return;

    try {
      await deleteTodo(todo._id).unwrap();
      toast.error("Todo deleted", {
        description: todo.title,
        icon: <Trash2Icon className="size-4" />,
      });
    } catch (error) {
      toast.error("Couldn't delete todo", { description: getErrorMessage(error) });
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete this todo?</AlertDialogTitle>
          <AlertDialogDescription>
            "{todo?.title}" will be permanently deleted. This can't be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
