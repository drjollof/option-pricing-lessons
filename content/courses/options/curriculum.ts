import { lesson1 } from './lessons/lesson-1';
import { lesson2 } from './lessons/lesson-2';
import { lesson3 } from './lessons/lesson-3';
import { lesson4 } from './lessons/lesson-4';
import { lesson5 } from './lessons/lesson-5';
import { lesson6 } from './lessons/lesson-6';
import { lesson7 } from './lessons/lesson-7';
import { lesson8 } from './lessons/lesson-8';
import { lesson9 } from './lessons/lesson-9';
import { lesson10 } from './lessons/lesson-10';
import { lesson11 } from './lessons/lesson-11';
import { lesson12 } from './lessons/lesson-12';
import { lesson13 } from './lessons/lesson-13';
import { lesson14 } from './lessons/lesson-14';
import { lesson15 } from './lessons/lesson-15';
import { lesson16 } from './lessons/lesson-16';

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
  lesson9,
  lesson10,
  lesson11,
  lesson12,
  lesson13,
  lesson14,
  lesson15,
  lesson16,
];

export const courseCurriculum: Course = {
  id: 'options',
  title: 'Derivative Pricing',
  description: 'Master the fundamentals of derivative pricing using the Binomial and Trinomial Models.',
  modules: [
    {
      id: 'module-1',
      title: 'The Binomial Model',
      lessons: [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8].map(l => ({
        id: l.id,
        title: l.title,
        description: l.description
      }))
    },
    {
      id: 'module-2',
      title: 'The Trinomial Model',
      lessons: [lesson9, lesson10, lesson11, lesson12].map(l => ({
        id: l.id,
        title: l.title,
        description: l.description
      }))
    },
    {
      id: 'module-3',
      title: 'Continuous-Time Models & Pricing',
      lessons: [lesson13, lesson14, lesson15, lesson16].map(l => ({
        id: l.id,
        title: l.title,
        description: l.description
      }))
    }
  ]
};
