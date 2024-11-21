import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

interface BoatCalendarProps {
  boatId: number;
}

interface BookingEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  status: string;
}

export default function BoatCalendar({ boatId }: BoatCalendarProps) {
  const [events, setEvents] = useState<BookingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [boatId]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/boats/${boatId}/bookings`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const formattedEvents = response.data.map((booking: any) => ({
        id: booking.id,
        title: `${booking.User.name} - ${booking.status}`,
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
        status: booking.status
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const eventStyleGetter = (event: BookingEvent) => {
    let backgroundColor = '#3174ad';
    switch (event.status) {
      case 'confirmed':
        backgroundColor = '#10B981';
        break;
      case 'pending':
        backgroundColor = '#F59E0B';
        break;
      case 'cancelled':
        backgroundColor = '#EF4444';
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px'
      }
    };
  };

  if (loading) {
    return <div>Loading calendar...</div>;
  }

  return (
    <div className="h-[600px] bg-white p-4 rounded-lg shadow">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventStyleGetter}
        views={['month', 'week', 'day']}
        defaultView="month"
        tooltipAccessor={(event: BookingEvent) => event.title}
      />
    </div>
  );
} 