import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { GetShowsByMovieId } from '../../api/show';
import Showheader from './Showheader';
import Showlist from './Showlist';

function Shows() {
  const { id, movieId } = useParams();
  const targetMovieId = id || movieId;
  const [, setSearchParams] = useSearchParams();

  const todayDate = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayDate);
  const [shows, setShows] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <section id="shows-section" className="w-full max-w-7xl mx-auto px-[clamp(0.5rem,2vw,2rem)] pt-[clamp(0.75rem,1.8vw,2rem)] pb-[clamp(1.5rem,3vw,3rem)] select-none">
      <Showheader date={date} onDateSelect={handleDateSelect} />
      <Showlist shows={shows} date={date} loading={loading} />
    </section>
  );
}

export default Shows;
