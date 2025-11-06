"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function HRNav() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/hr/dashboard" className="text-xl font-bold text-blue-600">
          JobHub
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/hr/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/hr/applications">
            <Button variant="ghost">Applications</Button>
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
