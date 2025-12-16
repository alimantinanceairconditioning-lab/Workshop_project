import { NextRequest, NextResponse } from "next/server";
import { uploadImageDirect } from "@/utils/uploadImageDirect";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string || "uploads";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Image too large. Maximum size is 10MB, got ${(file.size / 1024 / 1024).toFixed(2)}MB` 
        },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid file type. Allowed: JPG, PNG, WEBP, GIF. Got: ${file.type}` 
        },
        { status: 400 }
      );
    }

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using the utility
    const url = await uploadImageDirect(buffer, folder);

    return NextResponse.json({
      success: true,
      url,
      message: "Image uploaded successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to upload image" 
      },
      { status: 500 }
    );
  }
}
