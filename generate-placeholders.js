const fs = require('fs');
const path = require('path');

const dir = 'content/courses/econometrics/lessons';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

for (let i = 1; i <= 29; i++) {
  const content = `import { Lesson } from '../../../types';

export const lesson${i}: Lesson = {
  id: 'lesson-${i}',
  title: 'Lesson ${i}',
  description: 'Placeholder for Lesson ${i}',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, T: 1, N: 1, u: 1.1, d: 0.9, p: 0.5
  },
  phases: [
    {
      id: 'phase-1',
      title: 'Introduction',
      description: 'Coming soon...',
      kind: 'placeholder',
      stepTexts: [],
      formulas: []
    }
  ]
};
`;
  fs.writeFileSync(path.join(dir, `lesson-${i}.ts`), content);
}
console.log('Created 29 lesson placeholders.');
