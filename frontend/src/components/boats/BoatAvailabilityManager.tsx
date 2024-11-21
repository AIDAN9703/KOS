import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface BoatAvailabilityManagerProps {
  boatId: number;
}

const BoatAvailabilityManager: React.FC<BoatAvailabilityManagerProps> = ({ boatId }) => {
  const [availability, setAvailability] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchAvailability();
  }, [boatId]);

  const fetchAvailability = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/boats/${boatId}/availability`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAvailability(response.data);
    } catch (error) {
      console.error('Error fetching boat availability:', error);
    }
  };

  const handleSelect = async ({ start, end }: { start: Date; end: Date }) => {
    const newAvailability = { ...availability };
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dateString = currentDate.toISOString().split('T')[0];
      newAvailability[dateString] = !newAvailability[dateString];
      currentDate.setDate(currentDate.getDate() + 1);
    }

    try {
      await axios.put(`http://localhost:5000/api/boats/${boatId}/availability`, 
        { availabilitySchedule: newAvailability },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setAvailability(newAvailability);
    } catch (error) {
      console.error('Error updating boat availability:', error);
    }
  };

  const events = Object.entries(availability).map(([date, isAvailable]) => ({
    start: new Date(date),
    end: new Date(date),
    title: isAvailable ? 'Available' : 'Unavailable',
  }));

  return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelect}
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default BoatAvailabilityManager;
