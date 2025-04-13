"use client";

import { useState, useEffect } from "react";


interface Todo {
  id: number;
  text: string;
  completed: boolean;
}



export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState("");

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = async (id: number) => {
    const res = await fetch('/api/todos', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
    fetchTodoList();
  };

  const btn = () => {
    return (
      <button onClick={addTodo} className="btn btn-primary">
        Add1
      </button>
    );
  };

  const fetchTodoList = async () => {
    const res = await fetch('/api/todos');
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async () => {
    const res = await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ text: inputText }),
    });
    const data = await res.json();
    setTodos([...todos, data]);
  };  

  useEffect(() => {
    fetchTodoList();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-base-200">
      <div className="max-w-md mx-auto bg-base-100 rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">Todo List</h1>
        <button className="btn btn-primary" onClick={fetchTodoList}>refresh todolist</button>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
            placeholder="Add a new todo..."
            className="input input-bordered flex-1"
          />
          {btn()}
        </div>

        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between bg-base-200 p-3 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="checkbox checkbox-primary"
                />
                <span
                  className={`${
                    todo.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="btn btn-ghost btn-sm text-error"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
