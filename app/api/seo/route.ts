import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import SEO from "@/lib/models/seo.model";

export async function GET() {
  try {
    await connectDB();
    
    // Get the first (and only) SEO document
    let seo = await SEO.findOne();
    
    // If no SEO settings exist, create default one
    if (!seo) {
      seo = await SEO.create({});
    }
    
    return NextResponse.json({ success: true, seo });
  } catch (error: any) {
    console.error("Error fetching SEO settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch SEO settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const updates = await request.json();
    
    // Find and update the SEO document, or create if it doesn't exist
    let seo = await SEO.findOne();
    
    if (!seo) {
      seo = await SEO.create(updates);
    } else {
      seo = await SEO.findByIdAndUpdate(
        seo._id,
        updates,
        { new: true, runValidators: true }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "SEO settings updated successfully",
      seo,
    });
  } catch (error: any) {
    console.error("Error updating SEO settings:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update SEO settings" },
      { status: 500 }
    );
  }
}
