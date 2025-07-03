import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';

import Header from '../Header.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchEvent, deleteEvent } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import { queryClient } from '../../util/http.js';

export default function EventDetails() {
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id;

  const eventData = useQuery({
    queryKey: ['events', params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
    gcTime: 0
  });

  const data = eventData.data;

  const deleteMutation = useMutation({    // alternative Schreibweise für nameClashes {isPending: isPendingMutation}
    mutationFn: () => deleteEvent({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'], refetchType: 'none' }) // mit refetchType: none verhindern wir einen direkt httpREQ für diese keys
      navigate('/events')
    }
  })

  function deleteHandler() {
    deleteMutation.mutate();
  }

  let content;


  if (eventData.isError || deleteMutation.isError) {
    content = (
      <div id="event-details-content" className='center'>
        <ErrorBlock title="An error occured" message={eventData.error ? 'Loading event failed' : 'deletingEvent failed'} />
      </div>
    )
  }

  if (eventData.isLoading) {
    content = (
      <div id="event-details-content" className='center'>
        <LoadingIndicator />
      </div>
    )
  }

  if (data) {
    content = (
      <>
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={deleteHandler}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        {!deleteMutation.isPending && <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.image} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{data.time} @ {data.time}</time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>}
        {deleteMutation.isPending && <div id="event-details-content" className='center'>
          <LoadingIndicator />
        </div>}
      </>
    )
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        {content}
      </article>
    </>
  );
}





