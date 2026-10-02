import { Controller, type Control } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { TodoFormOutput, TodoFormValues } from "../schemas";

interface TodoFormFieldsProps {
  control: Control<TodoFormValues, unknown, TodoFormOutput>;
  idPrefix: string;
}

export function TodoFormFields({ control, idPrefix }: TodoFormFieldsProps) {
  const titleId = `${idPrefix}-title`;
  const descriptionId = `${idPrefix}-description`;

  return (
    <FieldGroup>
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={titleId}>Title</FieldLabel>
            <Input
              {...field}
              id={titleId}
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
            <FieldLabel htmlFor={descriptionId}>Description</FieldLabel>
            <Textarea
              {...field}
              id={descriptionId}
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
  );
}
