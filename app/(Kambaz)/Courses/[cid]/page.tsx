// When someone opens a course, I send them to its Home screen.
import { redirect } from "next/navigation";

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  redirect(`/Courses/${cid}/Home`);
}
