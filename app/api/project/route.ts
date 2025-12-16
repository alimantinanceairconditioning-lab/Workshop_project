import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/lib/models/project.model";

export const runtime = "nodejs";

// GET - Fetch all projects
export async function GET() {
    try {
        await connectDB();
        const projects = await Project.find({}).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: projects,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch projects",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

// POST - Create a new project
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        const { title, titleAr, description, descriptionAr, images } = body;

        // Validation
        if (!title || !description || !images || images.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "English title, description, and at least one image are required",
                },
                { status: 400 }
            );
        }

        // Optional Arabic validation - only validate if provided
        if (titleAr && titleAr.trim().length < 3) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Arabic title must be at least 3 characters if provided",
                },
                { status: 400 }
            );
        }

        if (descriptionAr && descriptionAr.trim().length < 10) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Arabic description must be at least 10 characters if provided",
                },
                { status: 400 }
            );
        }

        const project = await Project.create({
            title,
            titleAr,
            description,
            descriptionAr,
            images,
        });

        return NextResponse.json(
            {
                success: true,
                data: project,
                message: "Project created successfully",
            },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to create project",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
