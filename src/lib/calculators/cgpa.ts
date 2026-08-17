export type CgpaMode = 'simple' | 'weighted';

export interface SubjectGrade {
  id: string;
  name?: string;
  gradePoint: number;
  credits?: number;
}

export interface CgpaInput {
  mode: CgpaMode;
  subjects: SubjectGrade[];
}

export interface CgpaResult {
  cgpa: number;
  totalCredits: number;
  totalGradePoints: number;
  equivalentPercentage: number;
  subjectCount: number;
  isValid: boolean;
  error?: string;
}

export function calculateCGPA(input: CgpaInput): CgpaResult {
  const { mode, subjects } = input;

  if (!subjects || subjects.length === 0) {
    return {
      cgpa: 0,
      totalCredits: 0,
      totalGradePoints: 0,
      equivalentPercentage: 0,
      subjectCount: 0,
      isValid: false,
      error: 'Please add at least one subject to calculate CGPA.',
    };
  }

  // Filter valid grade point entries
  const validSubjects = subjects.filter((s) => !isNaN(s.gradePoint) && s.gradePoint >= 0);

  if (validSubjects.length === 0) {
    return {
      cgpa: 0,
      totalCredits: 0,
      totalGradePoints: 0,
      equivalentPercentage: 0,
      subjectCount: 0,
      isValid: false,
      error: 'Please enter valid grade points.',
    };
  }

  let cgpa = 0;
  let totalCredits = 0;
  let totalGradePoints = 0;

  if (mode === 'simple') {
    // Simple average CGPA
    const sumPoints = validSubjects.reduce((acc, s) => acc + s.gradePoint, 0);
    cgpa = sumPoints / validSubjects.length;
    totalGradePoints = sumPoints;
    totalCredits = validSubjects.length;
  } else {
    // Credit-weighted CGPA: sum(gradePoint * credit) / sum(credits)
    let weightedSum = 0;
    let creditSum = 0;

    validSubjects.forEach((s) => {
      const credit = !isNaN(Number(s.credits)) && Number(s.credits) > 0 ? Number(s.credits) : 1;
      weightedSum += s.gradePoint * credit;
      creditSum += credit;
    });

    if (creditSum === 0) {
      return {
        cgpa: 0,
        totalCredits: 0,
        totalGradePoints: 0,
        equivalentPercentage: 0,
        subjectCount: validSubjects.length,
        isValid: false,
        error: 'Total credits cannot be zero.',
      };
    }

    cgpa = weightedSum / creditSum;
    totalCredits = creditSum;
    totalGradePoints = weightedSum;
  }

  // Standard CBSE/Indian University conversion guideline: Percentage = CGPA * 9.5
  const equivalentPercentage = Math.min(100, Math.max(0, cgpa * 9.5));

  return {
    cgpa: Number(cgpa.toFixed(2)),
    totalCredits,
    totalGradePoints: Number(totalGradePoints.toFixed(2)),
    equivalentPercentage: Number(equivalentPercentage.toFixed(2)),
    subjectCount: validSubjects.length,
    isValid: true,
  };
}
