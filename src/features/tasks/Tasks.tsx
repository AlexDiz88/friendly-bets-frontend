import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectError, selectTasks } from './selectors';
import { createTask, loadTasks } from './tasksSlice';
import { useAppDispatch } from '../../store';

export default function Tasks(): JSX.Element {
  const error = useSelector(selectError);
  const tasks = useSelector(selectTasks);
  const [description, setDescription] = useState<string>('');
  const [name, setName] = useState<string>('');
  const dispatch = useAppDispatch();

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      const dispatchResult = await dispatch(createTask({ name, description }));
      if (createTask.fulfilled.match(dispatchResult)) {
        setDescription('');
        setName('');
      }
    },
    [dispatch, description, name]
  );
  useEffect(() => {
    dispatch(loadTasks());
  }, [dispatch]);

  return (
    <>
      <div>Tasks</div>
      <h3>Добавить задачу</h3>
      <form className="mb-3" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            className={`form-control ${error ? 'is-invalid' : ''}`}
            placeholder="Задача..."
            aria-label="Задача..."
            name="taskTitle"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className={`form-control ${error ? 'is-invalid' : ''}`}
            placeholder="Описание..."
            aria-label="Описание..."
            name="taskTitle"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            добавить
          </button>
        </div>
        {error && (
          <div className="invalid-feedback text-end" style={{ display: 'block' }}>
            {error}
          </div>
        )}
      </form>
      <h3>Задачи текущего юзера</h3>
      <ul>
        {
          tasks?.map((element) => <li key={element.id}>{element.name} {element.description}</li>)
        }
      </ul>
    </>
  );
}
