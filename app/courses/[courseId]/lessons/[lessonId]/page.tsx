import { coursesRegistry } from '@/content/coursesRegistry';
import { notFound } from 'next/navigation';
import { LessonClient } from './LessonClient';

export default async function LessonPage({ params }: { params: Promise<{ courseId: string, lessonId: string }> }) {
  const { courseId, lessonId } = await params;
  const courseData = coursesRegistry[courseId];
  if (!courseData) notFound();

  // Find the full lesson object containing phases and logic
  const lesson = courseData.fullLessons.find(l => l.id === lessonId);
  
  if (!lesson) notFound();

  return <LessonClient lesson={lesson} courseId={courseId} />;
}
