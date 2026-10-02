import { NewTodoButton } from "@/features/todos/components/NewTodoButton";
import { TodoList } from "@/features/todos/components/TodoList";

function App() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Todos</h1>
          <p className="text-muted-foreground">Keep track of what needs to get done.</p>
        </div>
        <NewTodoButton />
      </header>

      <TodoList />
    </main>
  );
}

export default App;
