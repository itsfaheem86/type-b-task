import { TodoForm } from "@/features/todos/components/TodoForm";
import { TodoList } from "@/features/todos/components/TodoList";

function App() {
  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Todos</h1>
        <p className="text-muted-foreground">Keep track of what needs to get done.</p>
      </header>

      <div className="grid items-start gap-6 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <aside className="md:sticky md:top-6">
          <TodoForm />
        </aside>
        <section aria-label="Todo list">
          <TodoList />
        </section>
      </div>
    </main>
  );
}

export default App;
