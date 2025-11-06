"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Application {
  id: string
  student_id: string
  status: string
  applied_at: string
  jobs: { title: string; company_name: string }
  student: { full_name: string; email: string }
}

export function ApplicationsList({ applications }: { applications: Application[] }) {
  const [updating, setUpdating] = useState<string | null>(null)
  const router = useRouter()

  const updateStatus = async (applicationId: string, newStatus: "shortlisted" | "rejected" | "accepted") => {
    const supabase = createClient()
    setUpdating(applicationId)

    try {
      const { error } = await supabase.from("applications").update({ status: newStatus }).eq("id", applicationId)

      if (error) throw error
      router.refresh()
    } catch (err) {
      console.error("Error updating application:", err)
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                No applications yet
              </TableCell>
            </TableRow>
          ) : (
            applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{app.student.full_name}</p>
                    <p className="text-sm text-slate-500">{app.student.email}</p>
                  </div>
                </TableCell>
                <TableCell>{app.jobs.title}</TableCell>
                <TableCell>{new Date(app.applied_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      app.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : app.status === "shortlisted"
                          ? "bg-blue-100 text-blue-800"
                          : app.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {app.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(app.id, "shortlisted")}
                      disabled={updating === app.id}
                    >
                      Shortlist
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateStatus(app.id, "rejected")}
                      disabled={updating === app.id}
                    >
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
