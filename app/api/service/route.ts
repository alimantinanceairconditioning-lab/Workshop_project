import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Service from "@/lib/models/service.model";
import { uploadImageDirect } from "@/utils/uploadImageDirect";

// Disable caching for fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0; // No caching

export async function GET() {
  try {
    await connectDB();
    
    // Optimize query - only select needed fields and use lean() for faster queries
    const services = await Service.find()
      .select('name nameAr slug shortDescription shortDescriptionAr longDescription longDescriptionAr metaTitle metaDescription features featuresAr faqs faqsAr image status createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    
    return NextResponse.json(
      { success: true, services },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Parse FormData
    const formData = await request.formData();
    
    // Get form fields
    const name = (formData.get("name") || "").toString().trim();
    const nameAr = (formData.get("nameAr") || "").toString().trim();
    const shortDescription = (formData.get("shortDescription") || "").toString().trim();
    const shortDescriptionAr = (formData.get("shortDescriptionAr") || "").toString().trim();
    const longDescription = (formData.get("longDescription") || "").toString().trim();
    const longDescriptionAr = (formData.get("longDescriptionAr") || "").toString().trim();
    const metaTitle = (formData.get("metaTitle") || "").toString().trim();
    const metaDescription = (formData.get("metaDescription") || "").toString().trim();
    const featuresStr = (formData.get("features") || "").toString().trim();
    const featuresArStr = (formData.get("featuresAr") || "").toString().trim();
    const faqsStr = (formData.get("faqs") || "").toString().trim();
    const faqsArStr = (formData.get("faqsAr") || "").toString().trim();
    const status = (formData.get("status") || "Active").toString().trim();
    
    const imageFile = formData.get("image") as File | null;

    // Parse features and faqs with error handling
    let features: string[] = [];
    let featuresAr: string[] = [];
    let faqs: { question: string; answer: string }[] = [];
    let faqsAr: { question: string; answer: string }[] = [];
    
    try {
      features = featuresStr ? JSON.parse(featuresStr) : [];
    } catch (e) {
      features = [];
    }
    
    try {
      featuresAr = featuresArStr ? JSON.parse(featuresArStr) : [];
    } catch (e) {
      featuresAr = [];
    }
    
    try {
      faqs = faqsStr ? JSON.parse(faqsStr) : [];
    } catch (e) {
      faqs = [];
    }
    
    try {
      faqsAr = faqsArStr ? JSON.parse(faqsArStr) : [];
    } catch (e) {
      faqsAr = [];
    }

    // Validation
    if (!name || name.length < 3) {
      return NextResponse.json(
        { success: false, error: "English name is required and must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (!nameAr || nameAr.length < 3) {
      return NextResponse.json(
        { success: false, error: "Arabic name is required and must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (!shortDescription || shortDescription.length < 10) {
      return NextResponse.json(
        { success: false, error: "English short description is required and must be at least 10 characters" },
        { status: 400 }
      );
    }

    if (!shortDescriptionAr || shortDescriptionAr.length < 10) {
      return NextResponse.json(
        { success: false, error: "Arabic short description is required and must be at least 10 characters" },
        { status: 400 }
      );
    }

    if (!longDescription || longDescription.length < 50) {
      return NextResponse.json(
        { success: false, error: "English long description is required and must be at least 50 characters" },
        { status: 400 }
      );
    }

    if (!longDescriptionAr || longDescriptionAr.length < 50) {
      return NextResponse.json(
        { success: false, error: "Arabic long description is required and must be at least 50 characters" },
        { status: 400 }
      );
    }

    if (features.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one English feature is required" },
        { status: 400 }
      );
    }

    if (featuresAr.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one Arabic feature is required" },
        { status: 400 }
      );
    }

    if (faqs.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one English FAQ is required" },
        { status: 400 }
      );
    }

    if (faqsAr.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one Arabic FAQ is required" },
        { status: 400 }
      );
    }

    let imageUrl = "";

    // Upload main image
    if (imageFile && imageFile.size > 0) {
      try {
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (imageFile.size > maxSize) {
          return NextResponse.json(
            { success: false, error: `Image too large. Maximum size is 10MB, got ${(imageFile.size / 1024 / 1024).toFixed(2)}MB` },
            { status: 400 }
          );
        }

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(imageFile.type)) {
          return NextResponse.json(
            { success: false, error: `Invalid file type. Allowed: JPG, PNG, WEBP, GIF. Got: ${imageFile.type}` },
            { status: 400 }
          );
        }

        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        imageUrl = await uploadImageDirect(buffer, "services");
      } catch (uploadError: any) {
        return NextResponse.json(
          { success: false, error: `Failed to upload image: ${uploadError.message}` },
          { status: 500 }
        );
      }
    }

    // Create service with proper meta fields
    const serviceData: any = {
      name,
      nameAr,
      shortDescription,
      shortDescriptionAr,
      longDescription,
      longDescriptionAr,
      features,
      featuresAr,
      faqs,
      faqsAr,
      image: imageUrl,
      gallery: [],
      status,
    };

    // Only add metaTitle if it has a value
    if (metaTitle && metaTitle.length > 0) {
      serviceData.metaTitle = metaTitle;
    }

    // Only add metaDescription if it has a value
    if (metaDescription && metaDescription.length > 0) {
      serviceData.metaDescription = metaDescription;
    }

    const newService = await Service.create(serviceData);

    return NextResponse.json({ success: true, service: newService }, { status: 201 });
  } catch (error: any) {
    console.error("Service creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create service" },
      { status: 500 }
    );
  }
}