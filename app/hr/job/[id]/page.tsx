import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationsList } from "@/components/applications-list"

export default async function HRJobPage({
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

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("created_by", user.id)
    .single()

  if (!job) {
    redirect("/hr/dashboard")
  }

  const { data: applications } = await supabase
    .from("applications")
    .select(`
      *,
      student:student_id(full_name, email),
      jobs:job_id(title, company_name)
    `)
    .eq("job_id", id)
    .order("applied_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
        <p className="text-slate-600 mt-2">{job.company_name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Location</CardTitle>
          </CardHeader>
          <CardContent>{job.location}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Status</CardTitle>
          </CardHeader>
          <CardContent>{job.status}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Deadline</CardTitle>
          </CardHeader>
          <CardContent>{new Date(job.deadline).toLocaleDateString()}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Applications</CardTitle>
          <CardDescription>Manage applications submitted for this role</CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicationsList applications={applications || []} />
        </CardContent>
      </Card>
    </div>
  )
}
