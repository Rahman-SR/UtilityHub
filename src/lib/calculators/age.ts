export interface AgeInput {
  birthDate: string; // YYYY-MM-DD
  asOfDate?: string; // YYYY-MM-DD (default today)
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  nextBirthdayDays: number;
  nextBirthdayWeekday: string;
  isValid: boolean;
  error?: string;
}

export function calculateAge(input: AgeInput): AgeResult {
  const { birthDate, asOfDate } = input;

  if (!birthDate) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalMonths: 0,
      totalWeeks: 0,
      totalDays: 0,
      nextBirthdayDays: 0,
      nextBirthdayWeekday: '',
      isValid: false,
      error: 'Please select a valid birth date.',
    };
  }

  const dob = new Date(birthDate);
  const target = asOfDate ? new Date(asOfDate) : new Date();

  if (isNaN(dob.getTime())) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalMonths: 0,
      totalWeeks: 0,
      totalDays: 0,
      nextBirthdayDays: 0,
      nextBirthdayWeekday: '',
      isValid: false,
      error: 'Invalid birth date format.',
    };
  }

  // Clear time portions for exact date math
  dob.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  if (dob > target) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalMonths: 0,
      totalWeeks: 0,
      totalDays: 0,
      nextBirthdayDays: 0,
      nextBirthdayWeekday: '',
      isValid: false,
      error: 'Birth date cannot be in the future.',
    };
  }

  let years = target.getFullYear() - dob.getFullYear();
  let months = target.getMonth() - dob.getMonth();
  let days = target.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    // Get total days in the previous month relative to target
    const prevMonthDate = new Date(target.getFullYear(), target.getMonth(), 0);
    days += prevMonthDate.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Total days calculation
  const diffTime = Math.abs(target.getTime() - dob.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;

  // Next Birthday Calculation
  const nextBirthday = new Date(target.getFullYear(), dob.getMonth(), dob.getDate());
  if (nextBirthday < target) {
    nextBirthday.setFullYear(target.getFullYear() + 1);
  }

  const nextBdayTime = nextBirthday.getTime() - target.getTime();
  const nextBirthdayDays = Math.ceil(nextBdayTime / (1000 * 60 * 60 * 24));

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const nextBirthdayWeekday = weekdays[nextBirthday.getDay()];

  return {
    years,
    months,
    days,
    totalMonths,
    totalWeeks,
    totalDays,
    nextBirthdayDays,
    nextBirthdayWeekday,
    isValid: true,
  };
}
