import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationsList } from "@/components/applications-list"

export default async function ApplicationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: applications } = await supabase
    .from("applications")
    .select(`
      *,
      jobs:job_id(title, company_name),
      profiles:student_id(full_name, email)
    `)
    .in("job_id", (await supabase.from("jobs").select("id").eq("created_by", user.id)).data?.map((j) => j.id) || [])
    .order("applied_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Applications</h1>
        <p className="text-slate-600 mt-2">Review and manage all applications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Requests</CardTitle>
          <CardDescription>All applications received for your job postings</CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicationsList applications={applications || []} />
        </CardContent>
      </Card>
    </div>
  )
}
