import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { JobDetails } from "@/components/job-details"

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: job } = await supabase.from("jobs").select("*").eq("id", id).eq("status", "open").single()

  if (!job) {
    redirect("/student/jobs")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: existingApplication } = await supabase
    .from("applications")
    .select("id")
    .eq("job_id", id)
    .eq("student_id", user.id)
    .single()

  return <JobDetails job={job} hasApplied={!!existingApplication} jobId={id} />
}
