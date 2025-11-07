"use client"

import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/router"

const supabaseUrl = "https://your-supabase-url.supabase.co"
const supabaseKey = "your-supabase-key"
const supabase = createClient(supabaseUrl, supabaseKey)

const Page = () => {
  const router = useRouter()
  const { id } = router.query

  const fetchApplications = async () => {
    const { data: applications } = await supabase
      .from("applications")
      .select(`
        *,
        profiles:student_id(full_name, email)
      `)
      .eq("job_id", id)
      .order("applied_at", { ascending: false })

    console.log(applications)
  }

  return (
    <div>
      <h1>Job Applications</h1>
      {/* Render applications here */}
    </div>
  )
}

export default Page
