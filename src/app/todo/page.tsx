"use client";

import { useState, useEffect } from "react";


interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}



export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取所有待办事项
  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
    } finally {
      setIsLoading(false);
    }
  };

  // 创建新的待办事项
  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodoText }),
      });

      if (!response.ok) throw new Error('Failed to create todo');
      const newTodo = await response.json();
      setTodos(prev => [newTodo, ...prev]);
      setNewTodoText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
    }
  };

  // 切换待办事项状态
  const toggleTodo = async (todo: Todo) => {
    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: todo.text,
          completed: !todo.completed,
        }),
      });

      if (!response.ok) throw new Error('Failed to update todo');
      const updatedTodo = await response.json();
      setTodos(prev =>
        prev.map(t => (t.id === todo.id ? updatedTodo : t))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  // 删除待办事项
  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete todo');
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  };

  // 初始加载待办事项
  useEffect(() => {
    fetchTodos();
  }, []);

  if (isLoading) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Todo List</h1>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* 添加新待办事项表单 */}
      <form onSubmit={createTodo} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-2 border text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Todo
          </button>
        </div>
      </form>

      {/* 待办事项列表 */}
      <ul className="space-y-4">
        {todos.map(todo => (
          <li
            key={todo.id}
            className="flex items-center gap-4 p-4 bg-white text-black rounded shadow"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo)}
              className="h-5 w-5 rounded border-gray-300 focus:ring-blue-500"
            />
            <span
              className={`flex-1 ${
                todo.completed ? 'line-through text-gray-500' : ''
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="px-3 py-1 text-sm text-red-600 hover:bg-red-100 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* 空状态 */}
      {todos.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No todos yet. Add one above!
        </div>
      )}
    </div>
  );
}
