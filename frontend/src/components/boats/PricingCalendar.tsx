import { useState } from 'react';
import { boatsApi } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { format, addMonths, startOfDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import type { BoatPrice } from '@/types/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from '@/components/ui/tooltip';

interface PricingCalendarProps {
  boatId: number;
  onTimeSlotSelect: (date: Date, hours: number, price: number, priceId: number) => void;
}

function CalendarSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4" />
      <div className="grid grid-cols-7 gap-1">
        {[...Array(35)].map((_, i) => (
          <div key={i} className="h-14 bg-gray-200 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function PricingCalendar({ boatId, onTimeSlotSelect }: PricingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const { data: pricing, isLoading: isPricingLoading } = useQuery({
    queryKey: ['boat-pricing', boatId, selectedDate],
    queryFn: async () => {
      if (!selectedDate) return null;
      const response = await boatsApi.getPricing(boatId, selectedDate.toISOString());
      return response.data;
    },
    enabled: !!boatId && !!selectedDate,
  });

  const { data: availability } = useQuery({
    queryKey: ['boat-availability', boatId, currentMonth],
    queryFn: async () => {
      const startDate = startOfMonth(currentMonth);
      const endDate = endOfMonth(currentMonth);
      const response = await boatsApi.getAvailability(boatId, startDate.toISOString(), endDate.toISOString());
      return response.data;
    },
    enabled: !!boatId,
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSlotSelect = (price: BoatPrice) => {
    if (!selectedDate) return;
    
    const bookingDate = new Date(selectedDate);
    bookingDate.setHours(9); // Default to 9 AM start time
    bookingDate.setMinutes(0);
    
    onTimeSlotSelect(bookingDate, price.hours, Number(price.price), price.id);
  };

  const isDateBooked = (date: Date) => {
    if (!availability?.conflictingBookings) return false;
    return availability.conflictingBookings.some(booking => 
      isSameDay(new Date(booking.startDate), date)
    );
  };

  const handleMonthChange = (increment: number) => {
    setCurrentMonth(prev => {
      const newDate = addMonths(prev, increment);
      return newDate;
    });
  };

  const handleDateHover = (date: Date, isBooked: boolean, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top - 10 });
    
    if (isBooked) {
      setTooltipContent('This date is already booked');
    } else if (date < startOfDay(new Date())) {
      setTooltipContent('Past dates are not available');
    } else {
      setTooltipContent('Available for booking');
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMonth.toString()}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow"
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <div className="space-x-2">
              <button
                onClick={() => handleMonthChange(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => handleMonthChange(1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                →
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          {availability ? (
            <div className="p-4">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map((date, i) => {
                  const isSelected = selectedDate && isSameDay(date, selectedDate);
                  const isDisabled = isDateBooked(date) || date < startOfDay(new Date());
                  
                  return (
                    <motion.button
                      key={date.toISOString()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => !isDisabled && handleDateSelect(date)}
                      onMouseEnter={(e) => handleDateHover(date, isDateBooked(date), e)}
                      onMouseLeave={() => setTooltipContent('')}
                      disabled={isDisabled}
                      className={`
                        p-2 h-14 flex items-center justify-center relative
                        transition-all duration-200
                        ${!isSameMonth(date, currentMonth) ? 'text-gray-300' : ''}
                        ${isToday(date) ? 'border-2 border-[#21336a]' : ''}
                        ${isSelected ? 'bg-[#21336a] text-white shadow-lg' : 'hover:bg-gray-100'}
                        ${isDisabled ? 'bg-gray-100 cursor-not-allowed text-gray-400' : ''}
                        rounded-lg
                      `}
                    >
                      <span className="text-sm">{format(date, 'd')}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4">
              <CalendarSkeleton />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Time Slots */}
      <AnimatePresence>
        {selectedDate && pricing?.prices && pricing.prices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <h3 className="text-lg font-semibold mb-4">Select Duration & Price</h3>
            <div className="space-y-3">
              {pricing.prices.map((price, index) => (
                <motion.button
                  key={price.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleTimeSlotSelect(price)}
                  disabled={!price.isActive}
                  className="w-full flex justify-between items-center p-4 rounded-lg border 
                           hover:border-[#21336a] hover:bg-[#21336a]/5 disabled:opacity-50
                           disabled:cursor-not-allowed transition-all duration-200"
                >
                  <span>{price.hours} hours</span>
                  <span className="font-semibold">${Number(price.price).toFixed(2)}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {tooltipContent && (
        <Tooltip
          content={tooltipContent}
          position={tooltipPosition}
        />
      )}
    </div>
  );
}