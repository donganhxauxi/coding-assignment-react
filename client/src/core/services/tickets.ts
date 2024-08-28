import { Ticket } from '@acme/shared-models';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export const useGetTickets = () => {
  return useQuery<unknown, unknown, Ticket[]>('tickets', async () =>
    axios.get('/api/tickets').then((res) => res.data)
  );
};

export const useSetTicketToCompleted = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ticketId: string) =>
      axios.put(`/api/tickets/${ticketId}/complete`),
    onMutate: async (ticketId) => {
      await queryClient.cancelQueries('tickets');

      const previousTickets = queryClient.getQueryData<Ticket[]>('tickets');

      if (previousTickets) {
        queryClient.setQueryData(
          'tickets',
          previousTickets.map((ticket) =>
            String(ticket.id) === ticketId
              ? { ...ticket, completed: true }
              : ticket
          )
        );
      }

      return { previousTickets };
    },
    onSuccess: () => {
      queryClient.invalidateQueries('tickets');
    },
  });
};

export const useSetTicketToInCompleted = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ticketId: string) =>
      axios.delete(`/api/tickets/${ticketId}/complete`),
    onMutate: async (ticketId) => {
      await queryClient.cancelQueries('tickets');

      const previousTickets = queryClient.getQueryData<Ticket[]>('tickets');

      if (previousTickets) {
        queryClient.setQueryData(
          'tickets',
          previousTickets.map((ticket) =>
            String(ticket.id) === ticketId
              ? { ...ticket, completed: false }
              : ticket
          )
        );
      }

      return { previousTickets };
    },
    onSuccess: () => {
      queryClient.invalidateQueries('tickets');
    },
  });
};

export const useUpdateAssignee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      userId,
    }: {
      ticketId: string;
      userId: string;
    }) => axios.put(`/api/tickets/${ticketId}/assign/${userId}`),
    onMutate: async ({ ticketId, userId }) => {
      await queryClient.cancelQueries('tickets');

      const previousTickets = queryClient.getQueryData<Ticket[]>('tickets');

      if (previousTickets) {
        queryClient.setQueryData(
          'tickets',
          previousTickets.map((ticket) =>
            String(ticket.id) === ticketId
              ? { ...ticket, assigneeId: userId }
              : ticket
          )
        );
      }

      return { previousTickets };
    },
    onSuccess: () => {
      queryClient.invalidateQueries('tickets');
    },
  });
};
