import { createClient } from "@/lib/supabase/server"
import { JobsTable } from "@/components/jobs-table"
import { CreateJobDialog } from "@/components/create-job-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function HRDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false })

  const { data: applicationsData } = await supabase
    .from("applications")
    .select("*, jobs(id)")
    .in("job_id", jobs?.map((job) => job.id) || [])

  const totalApplications = applicationsData?.length || 0
  const pendingApplications = applicationsData?.filter((app) => app.status === "pending").length || 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">HR Dashboard</h1>
          <p className="text-slate-600 mt-2">Manage job postings and applications</p>
        </div>
        <CreateJobDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {jobs?.filter((j) => j.status === "open").length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{pendingApplications}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Job Postings</CardTitle>
          <CardDescription>Manage and track all your job postings</CardDescription>
        </CardHeader>
        <CardContent>
          <JobsTable jobs={jobs || []} />
        </CardContent>
      </Card>
    </div>
  )
}
