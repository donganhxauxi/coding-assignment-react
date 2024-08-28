import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TasksColumn from './Column';
import { useGetUsers } from '../../core/services/users';
import { useUpdateAssignee } from '../../core/services/tickets';
import { Ticket } from '@acme/shared-models';
import { ModalProps } from '../modal/Modal';
import { Column } from '../../core/entities/column';

// Mock the dependencies
jest.mock('react-beautiful-dnd', () => ({
  Droppable: ({ children }: { children: React.FC }) =>
    children({ droppableProps: {}, innerRef: jest.fn() }),
  Draggable: ({ children }: { children: React.FC }) =>
    children({ draggableProps: {}, dragHandleProps: {}, innerRef: jest.fn() }),
}));

jest.mock(
  '../modal/Modal',
  () =>
    ({ show, onClose, title, children }: ModalProps) =>
      show ? (
        <div data-testid="modal">
          <h2>{title}</h2>
          {children}
        </div>
      ) : null
);

jest.mock('../../core/services/users', () => ({
  useGetUsers: jest.fn(),
}));

jest.mock('../../core/services/tickets', () => ({
  useUpdateAssignee: jest.fn(),
}));

describe('TasksColumn Component', () => {
  const column: Column = { id: '1', title: 'Incompleted' };
  const tickets: Ticket[] = [
    { id: 1, description: 'Task 1', assigneeId: 1, completed: false },
    { id: 2, description: 'Task 2', assigneeId: 2, completed: false },
  ];
  const users = [
    { id: '1', name: 'User 1' },
    { id: '2', name: 'User 2' },
  ];

  beforeEach(() => {
    (useGetUsers as jest.Mock).mockReturnValue({ data: users });
    (useUpdateAssignee as jest.Mock).mockReturnValue({ mutate: jest.fn() });
  });

  it('renders the column title', () => {
    render(<TasksColumn column={column} tickets={tickets} />);
    expect(screen.getByText('Incompleted')).toBeInTheDocument();
  });

  it('renders tickets within the column', () => {
    render(<TasksColumn column={column} tickets={tickets} />);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('updates the assignee through the modal', () => {
    const updateAssignee = jest.fn();
    (useUpdateAssignee as jest.Mock).mockReturnValue({
      mutate: updateAssignee,
    });

    render(<TasksColumn column={column} tickets={tickets} />);
    fireEvent.click(screen.getByText('Task 1'));

    fireEvent.change(screen.getByLabelText('Assign To'), {
      target: { value: '2' },
    });
    expect(updateAssignee).toHaveBeenCalledWith({ ticketId: '1', userId: '2' });
  });
});
