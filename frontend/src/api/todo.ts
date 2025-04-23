import API from './axios';
import { Todo } from '../store/useTodoStore';

// Helper to convert backend todo to frontend format
interface BackendTodo {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
}

const mapTodo = (todo: BackendTodo): Todo => ({
    id: todo.id,
    text: todo.text,
    completed: todo.completed,
    createdAt: todo.created_at,
  });

// Fetch all todos for the logged-in user
export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await API.get('/auth/todos/');
  //console.log(response.data);
  return response.data.map(mapTodo);
};

// Create a new todo
export const createTodo = async (text: string): Promise<Todo> => {
  const response = await API.post('/auth/todos/', { text });
  return mapTodo(response.data);
};

// Toggle a todo's completed status
export const toggleTodoStatus = async (id: number): Promise<Todo> => {
  const response = await API.patch(`/auth/todos/${id}/toggle/`);
  return mapTodo(response.data);
};

// Clear all completed todos
export const clearCompletedTodos = async (): Promise<void> => {
  await API.delete('/auth/todos/clear_completed/');
};
