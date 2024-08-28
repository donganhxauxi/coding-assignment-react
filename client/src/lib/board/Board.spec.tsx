import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Board from './Board';
import {
  useGetTickets,
  useSetTicketToCompleted,
  useSetTicketToInCompleted,
} from '../../core/services/tickets';

// Mock the hooks and components
jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('../column/Column', () => jest.fn(() => <div>Mocked Column</div>));
jest.mock('../../core/services/tickets', () => ({
  useGetTickets: jest.fn(),
  useSetTicketToCompleted: jest.fn(),
  useSetTicketToInCompleted: jest.fn(),
}));

describe('Board Component', () => {
  const tickets = [
    { id: '1', title: 'Ticket 1', completed: false },
    { id: '2', title: 'Ticket 2', completed: true },
  ];

  beforeEach(() => {
    (useGetTickets as jest.Mock).mockReturnValue({ data: tickets });
    (useSetTicketToCompleted as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
    });
    (useSetTicketToInCompleted as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
    });
  });

  it('renders the Board component', () => {
    render(<Board />);
    const column = screen.getAllByText('Mocked Column')[0];
    expect(column).toBeInTheDocument();
  });
});
