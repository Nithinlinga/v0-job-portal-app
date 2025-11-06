import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { HRNav } from "@/components/hr-nav"

export default async function HRLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "hr") {
    redirect("/student/jobs")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <HRNav />
      <main className="container mx-auto py-6">{children}</main>
    </div>
  )
}
