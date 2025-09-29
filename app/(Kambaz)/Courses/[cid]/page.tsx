import { redirect } from "next/navigation";

export default function CoursesPage({ params }: { params: { cid: string } }) {
    redirect(`/Courses/${params.cid}/Home`);
    return null;
}
