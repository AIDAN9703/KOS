import { useState, useEffect } from 'react';

interface SliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
}

export default function Slider({ min, max, value, onChange, step = 1 }: SliderProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (index: number, newValue: number) => {
    const updatedValue: [number, number] = [...localValue] as [number, number];
    updatedValue[index] = newValue;
    
    // Ensure min <= max
    if (index === 0 && newValue > localValue[1]) {
      updatedValue[1] = newValue;
    }
    if (index === 1 && newValue < localValue[0]) {
      updatedValue[0] = newValue;
    }

    setLocalValue(updatedValue);
    onChange(updatedValue);
  };

  return (
    <div className="space-y-4">
      <div className="relative h-2 bg-gray-200 rounded-full">
        <div
          className="absolute h-full bg-[#21336a] rounded-full"
          style={{
            left: `${((localValue[0] - min) / (max - min)) * 100}%`,
            right: `${100 - ((localValue[1] - min) / (max - min)) * 100}%`
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={(e) => handleChange(0, Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={(e) => handleChange(1, Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-sm">
        <span>${localValue[0]}</span>
        <span>${localValue[1]}</span>
      </div>
    </div>
  );
} 