/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useMemo } from 'react';
import { CSSTransition } from 'react-transition-group';
import { SelectedFilter } from '../../types/SelectedFilter';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => Promise<void>;
  loadingIds: number[];
  filter: SelectedFilter;
  onUpdateCheckbox: (updatedPost: Todo) => Promise<void>;
  onUpdateTitle: (updatedTodo: Todo, cur: string) => Promise<void>;
  editingTodo: number | null;
  onEditTodo: (todoId: number | null) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  loadingIds,
  filter,
  onUpdateCheckbox,
  onUpdateTitle,
  editingTodo,
  onEditTodo,
}) => {
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case SelectedFilter.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case SelectedFilter.COMPLETED:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, filter]);

  return filteredTodos.map((todo: Todo) => (
    <CSSTransition key={todo.id} timeout={300} classNames="item">
      <TodoItem
        todo={todo}
        onDelete={onDelete}
        loadingIds={loadingIds}
        onUpdateCheckbox={onUpdateCheckbox}
        onUpdateTitle={onUpdateTitle}
        editingTodo={editingTodo}
        onEditTodo={onEditTodo}
      />
    </CSSTransition>
  ));
};
