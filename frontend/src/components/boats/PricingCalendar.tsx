'use client';

import { useState, useEffect } from 'react';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { bookingApi } from '@/services/api';
import toast from 'react-hot-toast';

interface PricingCalendarProps {
  boatId: number;
  onDateSelect: (date: Date) => void;
  onDurationSelect: (duration: number | null) => void;
  onPriceSelect: (price: number | null) => void;
  onPriceOptionSelect: (priceId: number | null) => void;
}

interface PriceOption {
  id: number;
  hours: number;
  price: number;
  description?: string;
}

export default function PricingCalendar({ boatId, onDateSelect, onDurationSelect, onPriceSelect, onPriceOptionSelect }: PricingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [priceOptions, setPriceOptions] = useState<PriceOption[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  useEffect(() => {
    fetchBookedDates();
  }, [boatId]);

  useEffect(() => {
    if (selectedDate) {
      fetchPriceOptions();
    }
  }, [selectedDate]);

  const fetchBookedDates = async () => {
    try {
      const { data } = await bookingApi.getBoatAvailability(boatId);
      setBookedDates(data.map(date => new Date(date)));
    } catch (error) {
      console.error('Error fetching booked dates:', error);
    }
  };

  const fetchPriceOptions = async () => {
    try {
      const { data } = await bookingApi.getBoatPricing(boatId, selectedDate!);
      setPriceOptions(data);
    } catch (error) {
      console.error('Error fetching price options:', error);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onDateSelect(date);
    setSelectedDuration(null);
    onDurationSelect(null);
  };

  const handleDurationSelect = (duration: number) => {
    setSelectedDuration(duration);
    onDurationSelect(duration);
  };

  const isDateDisabled = (date: Date) => {
    return bookedDates.some(bookedDate => 
      bookedDate.toDateString() === date.toDateString()
    );
  };

  const handlePriceSelect = (priceOption: PriceOption) => {
    onDurationSelect(priceOption.hours);
    onPriceSelect(priceOption.price);
    onPriceOptionSelect(priceOption.id);
  };

  return (
    <div className="space-y-6">
      {/* Calendar Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="calendar-wrapper">
          <Calendar
            date={selectedDate || new Date()}
            onChange={handleDateSelect}
            minDate={new Date()}
            disabledDates={bookedDates}
            color="#21336a"
            className="custom-calendar"
          />
        </div>
      </div>

      {/* Duration Selection */}
      {selectedDate && priceOptions.length > 0 && (
        <div className="space-y-4">
          {priceOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                handleDurationSelect(option.hours);
                handlePriceSelect(option);
              }}
              className={`w-full relative p-4 border-2 rounded-xl transition-all duration-200
                ${selectedDuration === option.hours 
                  ? 'border-[#21336a] bg-[#21336a] text-white' 
                  : 'border-gray-200 hover:border-[#21336a]'
                }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-semibold">{option.hours} Hours</span>
                  {option.description && (
                    <p className={`text-sm mt-1 ${
                      selectedDuration === option.hours ? 'text-gray-200' : 'text-gray-500'
                    }`}>
                      {option.description}
                    </p>
                  )}
                </div>
                <span className={`text-xl font-bold ${
                  selectedDuration === option.hours ? 'text-white' : 'text-[#21336a]'
                }`}>
                  ${option.price}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 