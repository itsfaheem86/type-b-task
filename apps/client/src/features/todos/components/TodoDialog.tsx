import { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { getErrorMessage } from "@/lib/api-error";
import { todoFormSchema, type TodoFormValues } from "../schemas";
import { useCreateTodoMutation, useUpdateTodoMutation } from "../todosApi";
import type { Todo } from "../types";
import { TodoFormFields } from "./TodoFormFields";

interface TodoDialogProps {
  todo?: Todo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TodoDialog({ todo, open, onOpenChange }: TodoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{todo ? "Edit todo" : "New todo"}</DialogTitle>
          <DialogDescription>
            {todo ? "Update the title or description." : "Add a task to your list."}
          </DialogDescription>
        </DialogHeader>
        <TodoDialogForm todo={todo} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

interface TodoDialogFormProps {
  todo?: Todo;
  onDone: () => void;
}

function TodoDialogForm({ todo, onDone }: TodoDialogFormProps) {
  const formId = useId();
  const [createTodo] = useCreateTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      title: todo?.title ?? "",
      description: todo?.description ?? "",
    } satisfies TodoFormValues,
  });

  const onSubmit = handleSubmit(async ({ title, description }) => {
    if (todo) {
      try {
        const updated = await updateTodo({ id: todo._id, title, description }).unwrap();
        onDone();
        toast.success("Todo updated", { description: updated.title });
      } catch (error) {
        toast.error("Couldn't update todo", { description: getErrorMessage(error) });
      }
      return;
    }

    try {
      const created = await createTodo({ title, ...(description && { description }) }).unwrap();
      onDone();
      toast.success("Todo added", { description: created.title });
    } catch (error) {
      toast.error("Couldn't add todo", { description: getErrorMessage(error) });
    }
  });

  const submitLabel = todo ? "Save" : "Add todo";
  const submittingLabel = todo ? "Saving..." : "Adding...";

  return (
    <>
      <form id={formId} onSubmit={onSubmit} noValidate>
        <TodoFormFields control={control} idPrefix={formId} />
      </form>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit" form={formId} disabled={isSubmitting || (todo && !isDirty)}>
          {isSubmitting && <Spinner />}
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </DialogFooter>
    </>
  );
}
