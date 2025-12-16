import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/lib/models/project.model";
import mongoose from "mongoose";
import { deleteMultipleCloudinaryImages } from "@/utils/deleteCloudinaryImage";

export const runtime = "nodejs";

// GET - Fetch single project by ID
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid project ID",
                },
                { status: 400 }
            );
        }

        const project = await Project.findById(id);

        if (!project) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Project not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: project,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch project",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

// PATCH - Update project
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await context.params;
        const body = await request.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid project ID",
                },
                { status: 400 }
            );
        }

        // Get old project data to check for removed images
        const oldProject = await Project.findById(id);
        
        if (!oldProject) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Project not found",
                },
                { status: 404 }
            );
        }

        // If images are being updated, delete old images that are not in new list
        if (body.images && Array.isArray(body.images)) {
            const oldImages = oldProject.images || [];
            const newImages = body.images;
            
            // Find images that were removed
            const removedImages = oldImages.filter((img: string) => !newImages.includes(img));
            
            // Delete removed images from Cloudinary
            if (removedImages.length > 0) {
                await deleteMultipleCloudinaryImages(removedImages);
            }
        }

        // Update the project
        const project = await Project.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        return NextResponse.json({
            success: true,
            data: project,
            message: "Project updated successfully",
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update project",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

// DELETE - Delete project
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid project ID",
                },
                { status: 400 }
            );
        }

        // First, find the project to get image URLs
        const project = await Project.findById(id);

        if (!project) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Project not found",
                },
                { status: 404 }
            );
        }

        // Delete images from Cloudinary if they exist
        if (project.images && project.images.length > 0) {
            await deleteMultipleCloudinaryImages(project.images);
        }

        // Then delete the project from database
        await Project.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: "Project and images deleted successfully",
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete project",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
