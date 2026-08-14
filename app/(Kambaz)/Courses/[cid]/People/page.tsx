// The People table lives in People/Table, so I send visitors there.
import { redirect } from "next/navigation";

export default async function PeoplePage({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  redirect(`/Courses/${cid}/People/Table`);
}
