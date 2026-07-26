import { Course, Lesson } from './types';
import { courseCurriculum as optionsCurriculum, lessonsList as optionsLessons } from './courses/options/curriculum';
import { courseCurriculum as econometricsCurriculum, lessonsList as econometricsLessons } from './courses/econometrics/curriculum';

export interface CourseData {
  course: Course;
  fullLessons: Lesson[];
}

export const coursesRegistry: Record<string, CourseData> = {
  options: {
    course: optionsCurriculum,
    fullLessons: optionsLessons
  },
  econometrics: {
    course: econometricsCurriculum,
    fullLessons: econometricsLessons
  }
};
