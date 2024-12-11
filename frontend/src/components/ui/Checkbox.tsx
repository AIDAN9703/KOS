interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export default function Checkbox({ label, checked, onChange, className = '' }: CheckboxProps) {
  return (
    <label className={`flex items-center space-x-2 cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 border-2 border-gray-300 rounded focus:ring-[#21336a] 
                   text-[#21336a] transition-colors cursor-pointer"
        />
        {checked && (
          <svg
            className="absolute top-0 left-0 w-4 h-4 text-[#21336a] pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    </label>
  );
} 