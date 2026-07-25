import { lessons } from '@/content/lessons-index';
import { notFound } from 'next/navigation';
import { LessonClient } from './LessonClient';

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = lessons.find(l => l.id === lessonId);
  if (!lesson) notFound();

  return <LessonClient lesson={lesson} />;
}

export function generateStaticParams() {
  return lessons.map((lesson) => ({
    lessonId: lesson.id,
  }));
}
