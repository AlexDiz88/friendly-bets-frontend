import Task, { TaskId } from './types/Task';

export async function createTask(name: string, description: string): Promise<Task> {
	const res = await fetch('/api/tasks', {
		method: 'POST',
		body: JSON.stringify({ name, description }),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (res.status >= 400) {
		const { message }: { message: string } = await res.json();
		throw Error(message);
	}

	return res.json();
}

export async function updateTask(task: Task): Promise<void> {
	await fetch(`/api/tasks/${task.id}`, {
		method: 'PUT',
		body: JSON.stringify(task),
		headers: {
			'Content-Type': 'application/json',
		},
	});
}

export async function deleteTask(id: TaskId): Promise<void> {
	await fetch(`/api/tasks/${id}`, {
		method: 'DELETE',
	});
}

export async function getTasks(): Promise<{ tasks: Task[] }> {
	const result = await fetch('/api/users/my/tasks');
	return result.json();
}

export async function getTasksOfAll(): Promise<{ tasks: Task[] }> {
	const result = await fetch('/api/tasks');
	return result.json();
}
