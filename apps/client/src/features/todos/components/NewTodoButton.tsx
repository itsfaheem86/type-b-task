import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TodoDialog } from "./TodoDialog";

export function NewTodoButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusIcon />
        New todo
      </Button>
      <TodoDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
