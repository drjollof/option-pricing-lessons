const fs = require('fs');
const path = require('path');
const dir = 'content/courses/econometrics/lessons';

for (let i = 1; i <= 29; i++) {
  const filePath = path.join(dir, `lesson-${i}.ts`);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/, p: 0\.5/g, '');
    fs.writeFileSync(filePath, content);
  }
}
console.log('Fixed p: 0.5 in all lessons.');
