"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Job {
  id: string
  title: string
  company_name: string
  location: string
  job_type: string
  salary_min: number
  salary_max: number
  deadline: string
}

export function JobCard({ job }: { job: Job }) {
  const salary = job.salary_min && job.salary_max ? `$${job.salary_min}-$${job.salary_max}` : "Not specified"

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{job.title}</CardTitle>
        <CardDescription>{job.company_name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <p className="text-slate-600">
            <span className="font-medium text-slate-900">Location:</span> {job.location}
          </p>
          <p className="text-slate-600">
            <span className="font-medium text-slate-900">Type:</span>{" "}
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{job.job_type}</span>
          </p>
          <p className="text-slate-600">
            <span className="font-medium text-slate-900">Salary:</span> {salary}
          </p>
          <p className="text-slate-600">
            <span className="font-medium text-slate-900">Deadline:</span> {new Date(job.deadline).toLocaleDateString()}
          </p>
        </div>
        <Link href={`/student/job/${job.id}`}>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">View Details</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
