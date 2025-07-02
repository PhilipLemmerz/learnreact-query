import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { fetchEvents } from '../../util/http';
import LoadingIndicator from '../UI/LoadingIndicator';
import ErrorBlock from '../UI/ErrorBlock';
import EventItem from './EventItem';

export default function FindEventSection() {
  const searchElement = useRef();

  const [searchTerm, setSearchTerm] = useState();

  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value)
  }

  const query = useQuery({
    queryKey: ['events', searchTerm],                                 // dynamisches Element übergeben damit für jede Suchanfrage, das ergebnis indiv. gecached wird.
    queryFn: ({ signal }) => fetchEvents({ signal, searchTerm }),      // error function um params für fetchEvents() zu übergeben
    enabled: searchTerm !== undefined                                 // reqest wird nur gesendet wenn bedingung wahr ist -> prevent z.B. einen nicht gewollten inital request
  })

  let content = <p>Please enter a search term</p>

  if (query.isLoading) {
    content = <LoadingIndicator />
  }

  if (query.isError) {
    content = <ErrorBlock title="An error occured" message={query.error.info?.message || 'failed to fetch events'} />
  }

  if (query.data) {
    content = <ul className='events-list'>
      {
        query.data.map(event => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))
      }
    </ul>
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>

      </header>
      {content}
    </section>
  );
}
