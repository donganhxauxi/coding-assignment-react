import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import TasksColumn from '../column/Column';
import {
  useGetTickets,
  useSetTicketToCompleted,
  useSetTicketToInCompleted,
} from '../../core/services/tickets';

const Board = () => {
  const { data: tickets } = useGetTickets();

  const { mutate: setTicketToCompleted } = useSetTicketToCompleted();
  const { mutate: setTicketToInCompleted } = useSetTicketToInCompleted();

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (tickets) {
      switch (destination.droppableId) {
        case 'completed':
          // Move to completed
          setTicketToCompleted(draggableId);
          break;
        case 'inCompleted':
          // Move to incompleted
          setTicketToInCompleted(draggableId);
          break;
        default:
          break;
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 h-full">
        <TasksColumn
          column={{ title: 'Incompleted', id: 'inCompleted' }}
          tickets={tickets?.filter((ticket) => !ticket.completed)}
        />
        <TasksColumn
          column={{ title: 'Completed', id: 'completed' }}
          tickets={tickets?.filter((ticket) => ticket.completed)}
        />
      </div>
    </DragDropContext>
  );
};

export default Board;
