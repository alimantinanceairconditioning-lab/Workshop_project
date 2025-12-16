import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/admin.model";
import { generateToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { email, password } = await request.json();

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Find admin user with password field
        const admin = await Admin.findOne({ email: email.toLowerCase() })
            .select("+password")
            .exec();

        if (!admin) {
            return NextResponse.json(
                { success: false, error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Check if account is active
        if (!admin.isActive) {
            return NextResponse.json(
                { success: false, error: "Account is deactivated. Contact administrator." },
                { status: 403 }
            );
        }

        // Verify password
        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // Generate JWT token
        const token = generateToken({
            userId: admin._id.toString(),
            email: admin.email,
            name: admin.name,
            role: admin.role,
        });

        // Set HTTP-only cookie
        await setAuthCookie(token);

        // Return success with user data (without password)
        return NextResponse.json(
            {
                success: true,
                message: "Login successful",
                user: {
                    id: admin._id,
                    email: admin.email,
                    name: admin.name,
                    role: admin.role,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: "An error occurred during login" },
            { status: 500 }
        );
    }
}

export const runtime = 'nodejs'; // Use Node.js runtime for crypto support
