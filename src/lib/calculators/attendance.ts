export interface AttendanceInput {
  held: number;
  attended: number;
  targetPercentage?: number;
}

export interface AttendanceResult {
  currentPercentage: number;
  held: number;
  attended: number;
  status: 'on_track' | 'needs_more_classes' | 'above_target' | 'invalid';
  classesToAttend: number; // Upcoming classes needed to reach target
  classesCanBunk: number; // Classes user can afford to skip while staying above target
  targetPercentage: number;
  isValid: boolean;
  error?: string;
  recommendationMessage: string;
}

export function calculateAttendance(input: AttendanceInput): AttendanceResult {
  const { held, attended, targetPercentage = 75 } = input;

  if (isNaN(held) || held <= 0) {
    return {
      currentPercentage: 0,
      held: 0,
      attended: 0,
      status: 'invalid',
      classesToAttend: 0,
      classesCanBunk: 0,
      targetPercentage,
      isValid: false,
      error: 'Total classes held must be greater than 0.',
      recommendationMessage: 'Please enter total classes conducted so far.',
    };
  }

  if (isNaN(attended) || attended < 0) {
    return {
      currentPercentage: 0,
      held,
      attended: 0,
      status: 'invalid',
      classesToAttend: 0,
      classesCanBunk: 0,
      targetPercentage,
      isValid: false,
      error: 'Classes attended cannot be negative.',
      recommendationMessage: 'Please enter valid attended classes.',
    };
  }

  if (attended > held) {
    return {
      currentPercentage: 0,
      held,
      attended,
      status: 'invalid',
      classesToAttend: 0,
      classesCanBunk: 0,
      targetPercentage,
      isValid: false,
      error: 'Attended classes cannot exceed total classes held.',
      recommendationMessage: 'Attended classes cannot be greater than total classes held.',
    };
  }

  const validTarget = Math.min(100, Math.max(1, isNaN(targetPercentage) ? 75 : targetPercentage));
  const currentPercentage = (attended / held) * 100;

  let classesToAttend = 0;
  let classesCanBunk = 0;
  let status: 'on_track' | 'needs_more_classes' | 'above_target' = 'on_track';
  let recommendationMessage = '';

  if (currentPercentage >= validTarget) {
    // Already at or above target percentage!
    // Formula for safe bunks: (100 * attended - target * held) / target
    status = 'above_target';
    classesCanBunk = Math.floor((100 * attended - validTarget * held) / validTarget);
    if (classesCanBunk > 0) {
      recommendationMessage = `You are on track! You can safely skip the next ${classesCanBunk} class${
        classesCanBunk > 1 ? 'es' : ''
      } and still maintain ${validTarget}% attendance.`;
    } else {
      recommendationMessage = `You have met your ${validTarget}% target! Don't miss the next class to stay above target.`;
    }
  } else {
    // Below target percentage!
    // Formula for required classes: ceil((target * held - 100 * attended) / (100 - target))
    status = 'needs_more_classes';
    if (validTarget >= 100) {
      recommendationMessage = '100% attendance requires attending all future classes without missing any.';
      classesToAttend = 999;
    } else {
      const required = Math.ceil((validTarget * held - 100 * attended) / (100 - validTarget));
      classesToAttend = Math.max(0, required);
      recommendationMessage = `You need to attend the next ${classesToAttend} consecutive class${
        classesToAttend > 1 ? 'es' : ''
      } to reach your ${validTarget}% target attendance.`;
    }
  }

  return {
    currentPercentage: Number(currentPercentage.toFixed(2)),
    held,
    attended,
    status,
    classesToAttend,
    classesCanBunk,
    targetPercentage: validTarget,
    isValid: true,
    recommendationMessage,
  };
}
