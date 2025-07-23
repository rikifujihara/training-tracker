import { setupDatabase } from "@/lib/db/setup";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const result = await setupDatabase();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Setup failed:", error);
    return NextResponse.json(
      { success: false, error: "Database setup failed" },
      { status: 500 }
    );
  }
}
