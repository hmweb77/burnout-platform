import { NextResponse } from "next/server";
import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import * as brevo from "@getbrevo/brevo";
import fs from "fs";
import path from "path";
import resourcesData from "@/data/resources.json";

// Helper function to initialize Brevo API client
function getBrevoApiInstance() {
  // Check if BREVO_API_KEY is available
  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    console.warn("Make sure BREVO_API_KEY is set in .env.local file");
    // Debug: Show what Brevo-related env vars exist
    const brevoKeys = Object.keys(process.env).filter(key => key.includes('BREVO'));
    if (brevoKeys.length > 0) {
      console.warn("Found Brevo-related env vars:", brevoKeys);
    }
    return null;
  }

  // Validate API key format
  if (apiKey.trim().length < 10) {
    console.warn("BREVO_API_KEY appears to be invalid (too short)");
    return null;
  }

  try {
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      apiKey.trim()
    );
    return apiInstance;
  } catch (error) {
    console.error("Error initializing Brevo API:", error);
    return null;
  }
}

export async function POST(request) {
  try {
    // Read email and resourceId from request body
    const body = await request.json();
    const { email, resourceId } = body;

    console.log("Received request:", { email, resourceId, body });

    // Validate input
    if (!email || !resourceId) {
      console.error("Missing required fields:", { email: !!email, resourceId: !!resourceId });
      return NextResponse.json(
        { error: "Email and resourceId are required" },
        { status: 400 }
      );
    }

    // Locate resource in resources.json
    // Handle both string and number IDs
    const resource = resourcesData.find((r) => r.id === resourceId || r.id === String(resourceId) || r.id === Number(resourceId));

    if (!resource) {
      console.error("Resource not found for ID:", resourceId, "Available IDs:", resourcesData.map(r => r.id));
      return NextResponse.json(
        { error: "Resource not found", resourceId },
        { status: 404 }
      );
    }

    // Prepare email content
    const resourceUrl = resource.file
      ? `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${resource.file}`
      : resource.link;

    const emailSubject = `Your Resource: ${resource.title}`;
    const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Resource is Ready!</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for requesting <strong>${resource.title}</strong>.</p>
              <p>You can access your resource using the link below:</p>
              <p style="text-align: center;">
                <a href="${resourceUrl}" class="button">Access Resource</a>
              </p>
              ${resource.file ? `<p><strong>Note:</strong> This is a downloadable file. Click the button above to download it.</p>` : ""}
              <p>If you have any questions, feel free to reach out to us.</p>
              <p>Best regards,<br>Burnout Platform Team</p>
            </div>
            <div class="footer">
              <p>This email was sent because you requested a resource from our platform.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Prepare email data for Brevo
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = emailSubject;
    sendSmtpEmail.htmlContent = emailContent;
    sendSmtpEmail.sender = {
      name: "Burnout Platform",
      email: process.env.BREVO_SENDER_EMAIL || process.env.SENDER_EMAIL || "noreply@burnoutplatform.com",
    };
    sendSmtpEmail.to = [{ email }];

    // If resource has a file, attach it (optional - you can also just send the link)
    if (resource.file) {
      try {
        // Read file from public directory
        const filePath = path.join(process.cwd(), "public", resource.file);
        
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath);
          const fileName = path.basename(resource.file);
          
          sendSmtpEmail.attachment = [
            {
              name: fileName,
              content: fileContent.toString("base64"),
            },
          ];
        }
      } catch (fileError) {
        console.error("Error reading file:", fileError);
        // Continue without attachment - the link in email will work
      }
    }

    // Send email using Brevo
    const apiInstance = getBrevoApiInstance();
    let emailResult;
    
    if (!apiInstance) {
      console.error("Brevo API key not configured. Set BREVO_API_KEY environment variable.");
      // In development, allow the request to continue without sending email
      if (process.env.NODE_ENV === "development") {
        console.warn("Development mode: Skipping email send. Resource URL:", resourceUrl);
        emailResult = { messageId: "dev-mode-skip" };
      } else {
        return NextResponse.json(
          { error: "Email service not configured. Please contact support." },
          { status: 500 }
        );
      }
    } else {
      try {
        console.log("Sending email via Brevo to:", email);
        emailResult = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("Email sent successfully:", emailResult?.messageId);
      } catch (brevoError) {
        console.error("Brevo API Error:", brevoError);
        console.error("Brevo Error Status:", brevoError.statusCode || brevoError.response?.status);
        console.error("Brevo Error Response:", brevoError.response?.body || brevoError.body);
        
        // Handle 401 specifically
        if (brevoError.statusCode === 401 || brevoError.response?.status === 401) {
          return NextResponse.json(
            { 
              error: "Email service authentication failed", 
              details: "Invalid Brevo API key. Please check your BREVO_API_KEY environment variable."
            },
            { status: 500 }
          );
        }
        
        const errorMessage = brevoError.response?.body?.message || brevoError.body?.message || brevoError.message || "Failed to send email";
        return NextResponse.json(
          { error: "Failed to send email", details: errorMessage },
          { status: 500 }
        );
      }
    }

    // Save email + resourceId to Firestore
    try {
      await addDoc(collection(db, "resourceRequests"), {
        email,
        resourceId,
        resourceTitle: resource.title,
        resourceType: resource.type,
        requestedAt: serverTimestamp(),
        emailSent: true,
        brevoMessageId: emailResult?.messageId || null,
      });
    } catch (firestoreError) {
      console.error("Firestore Error:", firestoreError);
      // Don't fail the request if Firestore save fails, but log it
    }

    return NextResponse.json(
      {
        success: true,
        message: "Resource sent successfully",
        messageId: emailResult?.messageId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in send-resource API:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: "Internal server error", details: error.message || String(error) },
      { status: 500 }
    );
  }
}
