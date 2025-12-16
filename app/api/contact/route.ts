import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Contact from "@/lib/models/contact.model";
import { sendAdminNotificationEmail } from "@/lib/email";

export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, contacts });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { firstName, lastName, serviceType, phoneNumber, message } = await request.json();

    // Validation
    if (!firstName || !lastName || !serviceType || !phoneNumber || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const newContact = await Contact.create({
      firstName,
      lastName,
      serviceType,
      phoneNumber,
      message,
      status: "Pending",
    });

    // Send email notification to admin
    const emailResult = await sendAdminNotificationEmail({
      firstName,
      lastName,
      serviceType,
      phoneNumber,
      message,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Message received!", 
        contact: newContact,
        emailSent: emailResult.success 
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}

