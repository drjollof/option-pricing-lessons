import { lesson1 } from './lessons/lesson-1';
import { lesson2 } from './lessons/lesson-2';
import { lesson3 } from './lessons/lesson-3';
import { lesson4 } from './lessons/lesson-4';
import { lesson5 } from './lessons/lesson-5';
import { lesson6 } from './lessons/lesson-6';
import { lesson7 } from './lessons/lesson-7';
import { lesson8 } from './lessons/lesson-8';

import { Course } from '../../types';

export const lessonsList = [
  lesson1,
  lesson2,
  lesson3,
  lesson4,
  lesson5,
  lesson6,
  lesson7,
  lesson8,
];

export const courseCurriculum: Course = {
  id: 'options',
  title: 'Derivative Pricing',
  description: 'Master the fundamentals of derivative pricing using the Binomial Model and Monte Carlo simulations.',
  modules: [
    {
      id: 'module-1',
      title: 'The Binomial Model',
      lessons: lessonsList.map(l => ({
        id: l.id,
        title: l.title,
        description: l.description
      }))
    }
  ]
};
