import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/api-error";
import { todoFormSchema, type TodoFormValues } from "../schemas";
import { useCreateTodoMutation } from "../todosApi";

export function TodoForm() {
  const [createTodo] = useCreateTodoMutation();
  const {
    control,
    handleSubmit,
    reset,
    setFocus,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(todoFormSchema),
    defaultValues: { title: "", description: "" } satisfies TodoFormValues,
  });

  const onSubmit = handleSubmit(async ({ title, description }) => {
    try {
      const created = await createTodo({ title, ...(description && { description }) }).unwrap();
      reset();
      setFocus("title");
      toast.success("Todo added", { description: created.title });
    } catch (error) {
      toast.error("Couldn't add todo", { description: getErrorMessage(error) });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>New todo</CardTitle>
        <CardDescription>Add a task to your list.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="todo-form" onSubmit={onSubmit} noValidate>
          <FieldGroup>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="todo-title">Title</FieldLabel>
                  <Input
                    {...field}
                    id="todo-title"
                    placeholder="What needs to be done?"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="todo-description">Description</FieldLabel>
                  <Textarea
                    {...field}
                    id="todo-description"
                    placeholder="Add some details"
                    rows={3}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>Optional.</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="todo-form" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : <PlusIcon />}
          {isSubmitting ? "Adding..." : "Add todo"}
        </Button>
      </CardFooter>
    </Card>
  );
}
