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
    const { data: existingProfiles, error: selectError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user_id)
      .limit(1)

    if (selectError) {
      console.error("Error checking existing profile:", selectError)
      // Don't block creation, continue
    }

    if (existingProfiles && existingProfiles.length > 0) {
      return NextResponse.json(
        { message: "Profile already exists", profile: existingProfiles[0] },
        { status: 200 }
      )
    }

    // Create new profile
    const { data: insertedProfiles, error: createError } = await supabase
      .from("profiles")
      .insert({
        id: user_id,
        email,
        role,
        full_name: full_name || email.split("@")[0],
      })
      .select()

    if (createError) {
      console.error("Error creating profile:", createError)
      return NextResponse.json(
        { error: `Failed to create profile: ${createError.message}` },
        { status: 400 }
      )
    }

    if (!insertedProfiles || insertedProfiles.length === 0) {
      return NextResponse.json(
        { error: "Profile creation failed: No profile returned from database." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "Profile created successfully", profile: insertedProfiles[0] },
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
