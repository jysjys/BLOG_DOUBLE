export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

class TodoListService {
  private todos: Todo[] = [
    {
      id: 1,
      text: "Learn Next.js",
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      text: "Build a todo app",
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      text: "Deploy to production",
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ];

  async getTodos(): Promise<Todo[]> {
    return this.todos;
  }

  async addTodo(text: string): Promise<Todo> {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  async toggleTodo(id: number): Promise<Todo | null> {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) return null;
    todo.completed = !todo.completed;
    return todo;
  }

  async deleteTodo(id: number): Promise<boolean> {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter((todo) => todo.id !== id);
    return this.todos.length !== initialLength;
  }
}

export const todoListService = new TodoListService(); 