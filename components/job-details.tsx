"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Job {
  id: string
  title: string
  company_name: string
  location: string
  job_type: string
  salary_min: number
  salary_max: number
  description: string
  qualifications: string
  deadline: string
}

export function JobDetails({ job, hasApplied, jobId }: { job: Job; hasApplied: boolean; jobId: string }) {
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error: insertError } = await supabase.from("applications").insert({
        job_id: jobId,
        student_id: user.id,
        resume_url: "placeholder-resume-url",
        cover_letter: coverLetter,
        status: "pending",
      })

      if (insertError) throw insertError

      setSuccess(true)
      setCoverLetter("")
      setShowApplicationForm(false)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const salary = job.salary_min && job.salary_max ? `$${job.salary_min} - $${job.salary_max}` : "Not specified"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
        <p className="text-lg text-slate-600 mt-2">{job.company_name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-slate-900">{job.location}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Job Type</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-slate-900">{job.job_type}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Salary Range</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-slate-900">{salary}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Deadline</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-slate-900">{new Date(job.deadline).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 whitespace-pre-wrap">{job.description}</p>
            </CardContent>
          </Card>

          {job.qualifications && (
            <Card>
              <CardHeader>
                <CardTitle>Required Qualifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap">{job.qualifications}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          {hasApplied ? (
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-900">Applied</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-800">You have already applied for this position.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Apply Now</CardTitle>
                <CardDescription>Submit your application</CardDescription>
              </CardHeader>
              <CardContent>
                {!showApplicationForm ? (
                  <Button onClick={() => setShowApplicationForm(true)} className="w-full bg-blue-600 hover:bg-blue-700">
                    Apply for This Job
                  </Button>
                ) : (
                  <form onSubmit={handleApply} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Cover Letter</label>
                      <Textarea
                        placeholder="Tell us why you are interested in this position..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="h-32"
                        required
                      />
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {success && (
                      <Alert className="bg-green-50 border-green-200">
                        <AlertDescription className="text-green-800">
                          Application submitted successfully!
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                        {isLoading ? "Submitting..." : "Submit Application"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowApplicationForm(false)
                          setCoverLetter("")
                          setError(null)
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
