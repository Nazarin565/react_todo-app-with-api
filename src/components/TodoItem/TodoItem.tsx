/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';

type Props = {
  todo: Todo;
  onDelete?: (todoId: number) => Promise<void>;
  loadingIds: number[];
  onUpdateCheckbox?: (updatedPost: Todo) => Promise<void>;
  onUpdateTitle?: (updatedTodo: Todo, cur: string) => Promise<void>;
  editingTodo?: number | null;
  onEditTodo?: (todoId: number | null) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  onDelete = () => {},
  loadingIds = [],
  onUpdateCheckbox = () => {},
  onUpdateTitle = async () => {},
  editingTodo,
  onEditTodo = () => {},
}) => {
  const [currentTitle, setCurrentTitle] = useState(title);

  const formInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateTitle = (event: any) => {
    event.preventDefault();

    if (!currentTitle) {
      onDelete(id);
      setCurrentTitle(title);
      onEditTodo(null);
    } else if (currentTitle !== title) {
      onUpdateTitle(
        { id, title, userId: USER_ID, completed },
        currentTitle,
      ).catch(() => {
        if (editingTodo && formInputRef.current) {
          formInputRef.current.focus();
        }
      });
    }

    onEditTodo(null);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setCurrentTitle(title);
      onEditTodo(null);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() =>
            onUpdateCheckbox({ id, title, userId: USER_ID, completed })
          }
        />
      </label>
      {editingTodo === id ? (
        <form onSubmit={handleUpdateTitle}>
          <input
            ref={formInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            autoFocus
            value={currentTitle}
            onChange={event => setCurrentTitle(event.target.value)}
            onBlur={handleUpdateTitle}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onEditTodo(id)}
          >
            {currentTitle}
          </span>

          {id ? (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(id)}
            >
              x
            </button>
          ) : (
            ''
          )}
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingIds.includes(id),
        })}
      >
        {/* eslint-disable-next-line */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
