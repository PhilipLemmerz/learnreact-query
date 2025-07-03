import { Link, useNavigate, useParams } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchEvent, updateEvent } from '../../util/http.js';
import { queryClient } from '../../util/http.js';

export default function EditEvent() {
  const navigate = useNavigate();
  const params = useParams()
  const id = params.id

  const { data } = useQuery({
    queryKey: ['events', params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id })
  })

  const { mutate } = useMutation({
    mutationFn: updateEvent,
    onMutate: async (data) => {
      const newEvent = data.event;
      await queryClient.cancelQueries({ queryKey: ['events'] });

      const prevEvent = queryClient.getQueryData({ queryKey: ['events'] })

      queryClient.setQueryData(['events'], newEvent);

      return { fallbackData: prevEvent }
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(['events'], context.fallbackData);
    }
  })

  function handleSubmit(formData) {
    mutate({ id: id, event: formData });
    handleClose()
  }

  function handleClose() {
    navigate('../');
  }

  return (
    <Modal onClose={handleClose}>
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    </Modal>
  );
}
