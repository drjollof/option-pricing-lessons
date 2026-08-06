import { coursesRegistry } from '@/content/coursesRegistry';
import { notFound } from 'next/navigation';
import { LessonClient } from './LessonClient';

export default async function LessonPage({ params }: { params: Promise<{ courseId: string, lessonId: string }> }) {
  const { courseId, lessonId } = await params;
  const courseData = coursesRegistry[courseId];
  if (!courseData) notFound();

  // Find the full lesson object containing phases and logic
  const lessonIndex = courseData.fullLessons.findIndex(l => l.id === lessonId);
  const lesson = courseData.fullLessons[lessonIndex];
  
  if (!lesson) notFound();

  const prevLessonId = lessonIndex > 0 ? courseData.fullLessons[lessonIndex - 1].id : undefined;
  const nextLessonId = lessonIndex < courseData.fullLessons.length - 1 ? courseData.fullLessons[lessonIndex + 1].id : undefined;

  return <LessonClient lesson={lesson} courseId={courseId} prevLessonId={prevLessonId} nextLessonId={nextLessonId} />;
}
