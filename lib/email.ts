import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactEmailData {
  firstName: string;
  lastName: string;
  serviceType: string;
  phoneNumber: string;
  message: string;
}

/**
 * Send email notification to admin when new contact form is submitted
 */
export async function sendAdminNotificationEmail(data: ContactEmailData) {
  try {
    const { firstName, lastName, serviceType, phoneNumber, message } = data;

    // Check if Resend API key exists
    if (!process.env.RESEND_API_KEY) {
      return { success: false, error: "Email service not configured" };
    }

    // Get admin email from env or use default
    const adminEmail = process.env.ADMIN_EMAIL || "alimantinanceairconditioning@gmail.com";

    const emailResponse = await resend.emails.send({
      from: "Ali AC Service <onboarding@resend.dev>",
      to: adminEmail,
      subject: `🔔 New Service Inquiry: ${serviceType}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #1E3A8A 0%, #006FF1 100%); color: white; padding: 30px; text-align: center; }
              .header h1 { margin: 0; font-size: 24px; }
              .content { padding: 30px; }
              .detail-row { margin: 15px 0; padding: 15px; background: #f9fafb; border-left: 4px solid #006FF1; border-radius: 5px; }
              .label { font-weight: bold; color: #1E3A8A; margin-bottom: 5px; }
              .value { color: #374151; }
              .message-box { background: #f0f9ff; padding: 20px; border-radius: 8px; margin-top: 20px; border: 1px solid #bfdbfe; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; background: #f9fafb; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔔 New Service Inquiry</h1>
                <p style="margin: 10px 0 0 0;">Ali Air Conditioning & Refrigeration</p>
              </div>
              <div class="content">
                <p style="font-size: 16px; margin-bottom: 20px;">You have received a new inquiry from your website:</p>
                
                <div class="detail-row">
                  <div class="label">👤 Customer Name</div>
                  <div class="value">${firstName} ${lastName}</div>
                </div>

                <div class="detail-row">
                  <div class="label">🛠️ Service Type</div>
                  <div class="value">${serviceType}</div>
                </div>

                <div class="detail-row">
                  <div class="label">📞 Phone Number</div>
                  <div class="value"><a href="tel:${phoneNumber}" style="color: #006FF1; text-decoration: none;">${phoneNumber}</a></div>
                </div>

                <div class="message-box">
                  <div class="label">💬 Message</div>
                  <div class="value" style="margin-top: 10px; white-space: pre-wrap;">${message}</div>
                </div>
              </div>
              <div class="footer">
                <p><strong>مؤسسة علي للتكييف والتبريد</strong></p>
                <p style="margin-top: 10px; font-size: 12px;">
                  This is an automated notification from your contact form.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true, data: emailResponse };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
