"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Application {
  id: string
  student_id: string
  status: string
  applied_at: string
  student: {
    full_name: string
    email: string
  }
}

export function JobApplicationsList({
  applications,
  jobId,
}: {
  applications: Application[]
  jobId: string
}) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "shortlisted":
        return "bg-blue-100 text-blue-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate Name</TableHead>
            <TableHead>Email</TableHead>
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
                <TableCell className="font-medium">{app.student.full_name}</TableCell>
                <TableCell>{app.student.email}</TableCell>
                <TableCell>{formatDate(app.applied_at)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {app.status === "pending" && (
                      <>
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
                      </>
                    )}
                    {app.status === "shortlisted" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => updateStatus(app.id, "accepted")}
                          disabled={updating === app.id}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateStatus(app.id, "rejected")}
                          disabled={updating === app.id}
                        >
                          Reject
                        </Button>
                      </>
                    )}
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
