import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.tz.setDefault('America/New_York');
const localizer = momentLocalizer(moment);

interface BoatAvailabilityCalendarProps {
  boatId: number;
  refreshTrigger: number;
}

const BoatAvailabilityCalendar: React.FC<BoatAvailabilityCalendarProps> = ({ boatId, refreshTrigger }) => {
  const [bookedDates, setBookedDates] = useState<string[]>([]);

  useEffect(() => {
    fetchAvailability();
  }, [boatId, refreshTrigger]);

  const fetchAvailability = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/boats/${boatId}/availability`);
      setBookedDates(response.data);
    } catch (error) {
      console.error('Error fetching boat availability:', error);
    }
  };

  const events = bookedDates.map(date => ({
    start: moment.tz(date, 'America/New_York').toDate(),
    end: moment.tz(date, 'America/New_York').toDate(),
    title: 'Booked',
  }));

  const eventStyleGetter = () => ({
    style: {
      backgroundColor: '#EF4444',
      color: 'white',
      border: 'none'
    }
  });

  return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        eventPropGetter={eventStyleGetter}
        views={['month']}
      />
    </div>
  );
};

export default BoatAvailabilityCalendar;
