"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function StudentNav() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/student/jobs" className="text-xl font-bold text-blue-600">
          JobHub
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/student/jobs">
            <Button variant="ghost">Browse Jobs</Button>
          </Link>
          <Link href="/student/applications">
            <Button variant="ghost">My Applications</Button>
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
