import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, role, full_name, user_id } = await request.json()

    // Validate inputs
    if (!email || !role || !user_id) {
      return NextResponse.json(
        { error: "Missing required fields: email, role, user_id" },
        { status: 400 }
      )
    }

    // Validate role
    if (!["hr", "student"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'hr' or 'student'" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user_id)
      .single()

    if (existingProfile) {
      return NextResponse.json(
        { message: "Profile already exists", profile: existingProfile },
        { status: 200 }
      )
    }

    // Create new profile
    const { data: newProfile, error: createError } = await supabase
      .from("profiles")
      .insert({
        id: user_id,
        email,
        role,
        full_name: full_name || email.split("@")[0],
      })
      .select()
      .single()

    if (createError) {
      console.error("Error creating profile:", createError)
      return NextResponse.json(
        { error: `Failed to create profile: ${createError.message}` },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "Profile created successfully", profile: newProfile },
      { status: 201 }
    )
  } catch (error) {
    console.error("Profile creation error:", error)
    return NextResponse.json(
      { error: `Server error: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}
