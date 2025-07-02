import { Link, useNavigate } from 'react-router-dom';

import { queryClient } from '../../util/http.js';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation } from '@tanstack/react-query';
import { createNewEventHTTP } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';



export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEventHTTP,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['events']}) // all queries die 'events' enthalten werden invalidiert
      navigate('/events')                                   // > mit exact:true wird nur der exakte key invalidiert
    }
  })

  function handleSubmit(formData) {
    mutate({ event: formData })
  }


  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && 'Submitting...'}
        {!isPending &&
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        }
      </EventForm>
      {isError && <ErrorBlock title={error.title} message={error.info?.message || 'Event Creation failed'} />}
    </Modal>
  );
}
