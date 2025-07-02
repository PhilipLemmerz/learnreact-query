// import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';
import { fetchEvents } from '../../util/http.js';

export default function NewEventsSection() {

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['events'], // unter key wird Response gespeichert -> wir können Daten wiernutzen ohne neu zu fetchen
    queryFn: fetchEvents,
    staleTime: 10000, // für 10 Sekunden kein request mehr -> prevent unnessacary fetch() -> Defualt 0
    gcTime: 0 // Angabe wie lange Daten im Cache gespeichert werden sollen. -> DEFAULT 5 Minuten 
  }) 


  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock title="An error occurred" message={error.info?.message || 'An error occured'} />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
