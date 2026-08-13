// Typing /Courses/<id>/People sends the user to the People table.
import { redirect } from "next/navigation";

export default function People({ params }: { params: { cid: string } }) {
  redirect(`/Courses/${params.cid}/People/Table`);
}
