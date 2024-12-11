export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digits
  const number = value.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (number.length <= 3) return number;
  if (number.length <= 6) return `(${number.slice(0, 3)}) ${number.slice(3)}`;
  return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 10)}`;
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  // Check if matches (XXX) XXX-XXXX format
  const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
  return phoneRegex.test(phoneNumber);
};

export const standardizePhoneNumber = (phoneNumber: string): string => {
  // First remove all non-digits
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Ensure we have exactly 10 digits
  if (digits.length !== 10) {
    throw new Error('Phone number must be exactly 10 digits');
  }
  
  // Add +1 prefix
  return `+1${digits}`;
}; 