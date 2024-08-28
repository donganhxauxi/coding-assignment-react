import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Column } from '../../core/entities/column';
import { Ticket } from '@acme/shared-models';
import Modal from '../modal/Modal';
import { useGetUsers } from '../../core/services/users';
import { useUpdateAssignee } from '../../core/services/tickets';

interface ColumnProps {
  column: Column;
  tickets?: Ticket[];
}

const TasksColumn = ({ column, tickets }: ColumnProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const { data: users } = useGetUsers();

  const { mutate: updateAssignee } = useUpdateAssignee();

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };
  return (
    <div className="flex flex-col bg-gray-100 rounded-lg p-4 w-64 min-h-[calc(100vh-20px)] min-w-72">
      <h2 className="text-lg font-semibold mb-4">{column.title}</h2>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            className="flex flex-col gap-2"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {tickets
              ? tickets.map((ticket, index) => (
                  <Draggable
                    key={ticket.id}
                    draggableId={String(ticket.id)}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="bg-white p-4 rounded-lg shadow-md hover:cursor-pointer"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => handleTicketClick(ticket)}
                      >
                        {ticket.description}
                      </div>
                    )}
                  </Draggable>
                ))
              : null}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {selectedTicket && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          title={`Details for ${selectedTicket.description}`}
        >
          <div className="border-b pb-3 mb-3">
            <p className="text-gray-600 text-sm">Task ID</p>
            <p className="text-lg font-semibold">{selectedTicket.id}</p>
          </div>
          <div className="border-b pb-3 mb-3">
            <p className="text-gray-600 text-sm">Description</p>
            <p className="text-lg font-semibold">
              {selectedTicket.description}
            </p>
          </div>
          <div className="border-b pb-3 mb-3">
            <p className="text-gray-600 text-sm">Assignee</p>
            <p className="text-lg font-semibold">{selectedTicket.assigneeId}</p>
          </div>
          <div className="border-b pb-3 mb-3">
            <label htmlFor="assignee" className="text-gray-600 text-sm">
              Assign To
            </label>
            <select
              id="assignee"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              onChange={(event) => {
                updateAssignee({
                  ticketId: String(selectedTicket.id),
                  userId: event.target.value,
                });
              }}
            >
              {users?.map((user) => (
                <option
                  value={user.id}
                  selected={user.id === selectedTicket.assigneeId}
                >
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TasksColumn;
