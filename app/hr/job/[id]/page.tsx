import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JobApplicationsList } from "@/components/job-applications-list"

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: job } = await supabase.from("jobs").select("*").eq("id", id).eq("created_by", user.id).single()

  if (!job) {
    redirect("/hr/dashboard")
  }

  const { data: applications } = await supabase
    .from("applications")
    .select(`
      *,
      profiles:student_id(full_name, email)
    `)
    .eq("job_id", id)
    .order("applied_at", { ascending: false })

  const stats = {
    total: applications?.length || 0,
    pending: applications?.filter((a) => a.status === "pending").length || 0,
    shortlisted: applications?.filter((a) => a.status === "shortlisted").length || 0,
    accepted: applications?.filter((a) => a.status === "accepted").length || 0,
  }

  return (
    <div>
      <h1>Job Applications</h1>
      {/* Render applications here */}
    </div>
  )
}

export default Page
