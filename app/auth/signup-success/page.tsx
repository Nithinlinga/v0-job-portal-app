import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">Confirm Your Email</CardTitle>
          <CardDescription>We&apos;ve sent a confirmation link to your email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-slate-600">
            Please check your email and click the confirmation link to activate your account. Once confirmed, you can
            log in to JobHub.
          </p>
          <Link href="/auth/login" className="block">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Back to Login</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
