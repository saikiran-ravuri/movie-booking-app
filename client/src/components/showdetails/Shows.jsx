import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { GetShowsByMovieId } from '../../api/show';
import Showheader from './Showheader';
import Showlist from './Showlist';

function Shows() {
  const { id, movieId } = useParams();
  const targetMovieId = id || movieId;
  const [, setSearchParams] = useSearchParams();

  // Always default date to today's date on initial load or page refresh
  const todayDate = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayDate);
  const [shows, setShows] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!targetMovieId) return;

    const fetchShowDetails = async () => {
      setLoading(true);
      const res = await GetShowsByMovieId(targetMovieId, date);
      setShows(res?.data || {});
      setLoading(false);
    };

    fetchShowDetails();
  }, [targetMovieId, date]);

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    setSearchParams({ date: selectedDate });
  };

  return (
    <section id="shows-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-0 select-none">
      <Showheader date={date} onDateSelect={handleDateSelect} />
      <Showlist shows={shows} date={date} loading={loading} />
    </section>
  );
}

export default Shows;
