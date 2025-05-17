/**
 * This file defines the `useTodoStore` hook, which is a Zustand store for managing the state of a to-do application.
 * It provides state management and asynchronous actions for fetching, adding, toggling, and clearing to-dos.
 * 
 * The store includes the following state properties:
 * - `todos`: An array of to-do items.
 * - `filter`: A string representing the current filter for displaying to-dos (e.g., "all", "completed", "active").
 * - `loading`: A boolean indicating whether an asynchronous operation is in progress.
 * - `error`: A string or null representing the error message from the last failed operation.
 * 
 * The store also provides the following actions:
 * - `fetchTodosFromAPI`: Fetches to-dos from an API and updates the store.
 * - `addTodo`: Adds a new to-do item to the store.
 * - `toggleTodo`: Toggles the completion status of a to-do item.
 * - `clearCompleted`: Removes all completed to-dos from the store.
 * - `setFilter`: Updates the filter for displaying to-dos.
 * 
 * Each action handles errors gracefully by updating the `error` state and ensures the `loading` state is managed appropriately.
 * 
 * This store is designed to be used in a React application to manage the state of a to-do list.
 */

import { create } from "zustand";
import {
  fetchTodos,
  createTodo,
  toggleTodoStatus,
  clearCompletedTodos,
} from "../api/todo";

export interface Todo {
  id?: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

type Filter = "all" | "active" | "completed";

interface TodoState {
  todos: Todo[];
  filter: Filter;
  loading: boolean;
  error: string | null;
  fetchTodosFromAPI: () => Promise<void>;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  clearCompleted: () => Promise<void>;
  setFilter: (filter: Filter) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  filter: "all",
  loading: false,
  error: null,

  fetchTodosFromAPI: async () => {
    set({ loading: true, error: null });
    try {
      const todos = await fetchTodos();
      set({ todos: todos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), loading: false });

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch todos";
      set({ error: errorMessage, loading: false });
    }
  },

  addTodo: async (text: string) => {
    try {
      const newTodo = await createTodo(text);
      set((state) => ({
        todos: [newTodo, ...state.todos],
      }));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add todo";
      set({ error: errorMessage, loading: false });
    }
  },

  toggleTodo: async (id: number) => {
    try {
      const updated = await toggleTodoStatus(id);
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? updated : todo
        ),
      }));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to toggle todo";
      set({ error: errorMessage, loading: false });
    }
    
  },

  clearCompleted: async () => {
    try {
      await clearCompletedTodos();
      set((state) => ({
        todos: state.todos.filter((todo) => !todo.completed),
      }));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to clear completed todos";
      set({ error: errorMessage, loading: false });
    }
  },

  setFilter: (filter: Filter) => set({ filter }),
}));
