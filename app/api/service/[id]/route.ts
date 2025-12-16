import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Service from "@/lib/models/service.model";
import { deleteCloudinaryImage } from "@/utils/deleteCloudinaryImage";

// DELETE - Delete a service
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    // First, find the service to get image URL
    const service = await Service.findById(id);

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if it exists
    if (service.image && service.image.includes('cloudinary.com')) {
      await deleteCloudinaryImage(service.image);
    }

    // Then delete the service from database
    await Service.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "Service and image deleted successfully" },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete service" },
      { status: 500 }
    );
  }
}

// PATCH - Update service status
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const { status } = await request.json();

    // Validate status
    if (!status || !["Active", "Inactive"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status. Must be 'Active' or 'Inactive'" },
        { status: 400 }
      );
    }

    // Find and update the service
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, service: updatedService, message: "Service updated successfully" },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update service" },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
