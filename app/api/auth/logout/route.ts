import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
    try {
        // Clear the authentication cookie
        await clearAuthCookie();

        return NextResponse.json(
            { success: true, message: "Logged out successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: "An error occurred during logout" },
            { status: 500 }
        );
    }
}

export const runtime = 'nodejs'; // Use Node.js runtime for crypto support
