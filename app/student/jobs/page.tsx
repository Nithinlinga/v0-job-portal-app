"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { JobCard } from "@/components/job-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

interface Job {
  id: string
  title: string
  company_name: string
  location: string
  job_type: string
  salary_min: number
  salary_max: number
  description: string
  deadline: string
}

export default function StudentJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [jobType, setJobType] = useState<string | null>(null)
  const [location, setLocation] = useState("")

  useEffect(() => {
    const fetchJobs = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false })

      setJobs(data || [])
      setIsLoading(false)
    }

    fetchJobs()
  }, [])

  useEffect(() => {
    let filtered = jobs

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company_name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (jobType) {
      filtered = filtered.filter((job) => job.job_type === jobType)
    }

    if (location) {
      filtered = filtered.filter((job) => job.location.toLowerCase().includes(location.toLowerCase()))
    }

    setFilteredJobs(filtered)
  }, [jobs, searchTerm, jobType, location])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Find Jobs</h1>
        <p className="text-slate-600 mt-2">Explore opportunities that match your profile</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Search Jobs</label>
            <Input
              placeholder="Job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Job Type</label>
            <Select value={jobType || "all"} onValueChange={(value) => setJobType(value || null)}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Location</label>
            <Input placeholder="City or country..." value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
        </div>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center text-slate-500">Loading jobs...</Card>
      ) : filteredJobs.length === 0 ? (
        <Card className="p-8 text-center text-slate-500">No jobs found matching your criteria</Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}
