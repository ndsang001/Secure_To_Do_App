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
