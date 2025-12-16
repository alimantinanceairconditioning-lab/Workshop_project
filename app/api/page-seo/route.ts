import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PageSEO from "@/lib/models/pageSeo.model";

// GET - Fetch all page SEO settings or specific page
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');
    
    if (pageId) {
      // Fetch specific page SEO
      const pageSEO = await PageSEO.findOne({ pageId });
      
      if (!pageSEO) {
        return NextResponse.json(
          { success: false, error: "Page SEO not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ success: true, data: pageSEO });
    } else {
      // Fetch all page SEO settings
      const allPageSEO = await PageSEO.find().sort({ pageId: 1 });
      return NextResponse.json({ success: true, data: allPageSEO });
    }
  } catch (error) {
    console.error("Error fetching page SEO:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch page SEO" },
      { status: 500 }
    );
  }
}

// POST - Create new page SEO
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Check if page SEO already exists
    const existingPageSEO = await PageSEO.findOne({ pageId: body.pageId });
    if (existingPageSEO) {
      return NextResponse.json(
        { success: false, error: "Page SEO already exists. Use PUT to update." },
        { status: 400 }
      );
    }
    
    const pageSEO = await PageSEO.create(body);
    
    return NextResponse.json(
      { success: true, data: pageSEO, message: "Page SEO created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating page SEO:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create page SEO" },
      { status: 500 }
    );
  }
}

// PUT - Update page SEO
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { pageId, ...updateData } = body;
    
    if (!pageId) {
      return NextResponse.json(
        { success: false, error: "Page ID is required" },
        { status: 400 }
      );
    }
    
    const pageSEO = await PageSEO.findOneAndUpdate(
      { pageId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!pageSEO) {
      return NextResponse.json(
        { success: false, error: "Page SEO not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: pageSEO,
      message: "Page SEO updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating page SEO:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update page SEO" },
      { status: 500 }
    );
  }
}

// DELETE - Delete page SEO
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');
    
    if (!pageId) {
      return NextResponse.json(
        { success: false, error: "Page ID is required" },
        { status: 400 }
      );
    }
    
    const pageSEO = await PageSEO.findOneAndDelete({ pageId });
    
    if (!pageSEO) {
      return NextResponse.json(
        { success: false, error: "Page SEO not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Page SEO deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting page SEO:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete page SEO" },
      { status: 500 }
    );
  }
}
