import Task, { TaskId } from './types/Task';
// все запросы на сервер касательно тасков объединены в этом файлике
// в остальной программе, мы будем делать запросы только опосредованно через api
// запрос на создание таска
export async function createTask(name: string, description: string): Promise<Task> {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (res.status >= 400) {
    const { message } = await res.json();
    throw Error(message);
  }

  return res.json();
}
// пример запроса на обновление таска
export async function updateTask(task: Task): Promise<void> {
  await fetch(`/api/tasks/${task.id}`, {
    method: 'PUT',
    body: JSON.stringify(task),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
// на удаление права только у админа
export async function deleteTask(id: TaskId): Promise<void> {
  await fetch(`/api/tasks/${id}`, {
    method: 'DELETE',
  });
}

// доступ у юзера - таски текущего пользователя
export async function getTasks(): Promise<{ tasks: Task[] }> {
  const result = await fetch('/api/users/my/tasks');
  return result.json();
}

// доступ только у админа - получение с сервера всех задач всех пользователей
export async function getTasksOfAll(): Promise<{ tasks: Task[] }> {
  const result = await fetch('/api/tasks');
  return result.json();
}
