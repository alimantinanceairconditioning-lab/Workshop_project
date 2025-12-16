import { NextResponse, NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        // Get current authenticated user
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { success: false, authenticated: false, error: "Not authenticated" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                authenticated: true,
                user: {
                    id: user.userId,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, authenticated: false, error: "Session verification failed" },
            { status: 500 }
        );
    }
}

export const runtime = 'nodejs'; // Use Node.js runtime for crypto support
