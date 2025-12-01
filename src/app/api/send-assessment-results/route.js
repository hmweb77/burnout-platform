// file: app/api/send-assessment-results/route.js  (or wherever your route lives)
import { NextResponse } from "next/server";
import * as brevo from "@getbrevo/brevo";

function getBrevoApiInstance() {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("BREVO_API_KEY not set");
    return null;
  }
  if (apiKey.trim().length < 10) {
    console.warn("BREVO_API_KEY seems too short");
    return null;
  }
  try {
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey.trim());
    return apiInstance;
  } catch (err) {
    console.error("Error initializing Brevo client:", err);
    return null;
  }
}

function getColorCode(levelColor) {
  const colors = { red: "#ef4444", yellow: "#eab308", green: "#22c55e", gray: "#6b7280" };
  return colors[levelColor] || colors.gray;
}

function safeNumber(n, fallback = 0) {
  return typeof n === "number" && !Number.isNaN(n) ? n : fallback;
}

function generateResultsHTML(score = {}, answers = {}) {
  // Basic validation: ensure required fields exist to avoid creating malformed HTML
  const {
    physical = {},
    emotional = {},
    mindset = {},
    lifestyle = {},
    totalSummary = {},
    percentage = 0,
    maxPossibleScore = 60,
  } = score || {};

  const dimensions = {
    physicalWellbeing: { ...physical, max: 15, name: "Physical Wellbeing" },
    emotionalWellbeing: { ...emotional, max: 15, name: "Emotional Wellbeing" },
    mindsetWellbeing: { ...mindset, max: 15, name: "Mindset Wellbeing" },
    lifestyleBalance: { ...lifestyle, max: 15, name: "Lifestyle Balance" },
  };

  const formatCategoryName = (name) => {
    const map = {
      physical: "Physical Wellbeing",
      emotional: "Emotional Wellbeing",
      mindset: "Mindset Wellbeing",
      lifestyle: "Lifestyle Balance",
      physicalWellbeing: "Physical Wellbeing",
      emotionalWellbeing: "Emotional Wellbeing",
      mindsetWellbeing: "Mindset Wellbeing",
      lifestyleBalance: "Lifestyle Balance",
    };
    if (map[name]) return map[name];
    return name.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()).trim();
  };

  // Build simple plain-text fallback for deliverability debugging
  const plainTextSummary = `
Your Burnout Assessment Results
Overall: ${safeNumber(totalSummary.totalScore)}/${maxPossibleScore} (${safeNumber(percentage)}%)
Strongest: ${formatCategoryName(totalSummary.strongestDimension || "N/A")}
Weakest: ${formatCategoryName(totalSummary.weakestDimension || "N/A")}

Details:
${Object.entries(dimensions).map(([k, d]) => {
    return `${d.name}: ${safeNumber(d.score)}/${d.max} — ${d.category || "N/A"}`;
  }).join("\n")}
`;

  // Build HTML - keep it simple & valid
  const html = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>Assessment Results</title>
      <style>
        body { font-family: Arial, sans-serif; color:#1f2937; line-height:1.5; }
        .container{max-width:600px;margin:0 auto;padding:20px;}
        .header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;padding:24px;border-radius:8px;text-align:center}
        .box{background:#fff;padding:18px;border-radius:8px;margin-top:16px;border:1px solid #e6edf3}
        .title{font-weight:700}
        .small{font-size:13px;color:#475569}
        .rec{background:#f0f9ff;padding:12px;border-left:4px solid #0ea5e9;border-radius:6px;margin-top:8px}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>Your Burnout Assessment Results</h1></div>
        <div class="box">
          <p class="title">Overall Score</p>
          <p style="font-size:24px;margin:8px 0">${safeNumber(totalSummary.totalScore)}/${maxPossibleScore}</p>
          <p class="small">Percentage: ${safeNumber(percentage)}%</p>
        </div>

        ${Object.entries(dimensions).map(([key, d]) => {
          const pct = ((safeNumber(d.score) / d.max) * 100).toFixed(1);
          return `
            <div class="box">
              <strong>${d.name}</strong>
              <div style="margin-top:6px">${safeNumber(d.score)}/${d.max} (${pct}%)</div>
              ${d.interpretation ? `<div class="small" style="margin-top:6px">${d.interpretation}</div>` : ''}
              ${d.recommendation ? `<div class="rec"><strong>Recommendation:</strong><div>${d.recommendation}</div></div>` : ''}
            </div>
          `;
        }).join('')}

        <div class="box small" style="margin-top:16px;color:#334155">
          <strong>Note:</strong> These results are informational and not a substitute for professional help.
        </div>
      </div>
    </body>
  </html>
  `;

  return { html, text: plainTextSummary };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, answers, score } = body;

    // Basic validation
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
    if (!score) return NextResponse.json({ error: "Score is required" }, { status: 400 });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return NextResponse.json({ error: "Invalid email format" }, { status: 400 });

    // Get Brevo instance
    const apiInstance = getBrevoApiInstance();
    if (!apiInstance) {
      console.error("❌ BREVO_API_KEY not configured or invalid");
      return NextResponse.json({ 
        error: "Email service not configured", 
        details: "BREVO_API_KEY is missing or invalid. Please check your environment variables." 
      }, { status: 500 });
    }

    // Log environment info for debugging
    console.log("📧 Email sending configuration:", {
      nodeEnv: process.env.NODE_ENV,
      hasApiKey: !!process.env.BREVO_API_KEY,
      apiKeyLength: process.env.BREVO_API_KEY?.length || 0,
      senderEmail: process.env.BREVO_SENDER_EMAIL || process.env.SENDER_EMAIL || "noreply@burnoutplatform.com",
    });

    // Create email content
    const { html: emailHtml, text: emailText } = generateResultsHTML(score, answers);
    const emailSubject = "Your Burnout Assessment Results";

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = emailSubject;
    sendSmtpEmail.htmlContent = emailHtml;
    sendSmtpEmail.textContent = emailText; // fallback
    sendSmtpEmail.sender = {
      name: "Burnout Platform",
      email: process.env.BREVO_SENDER_EMAIL || process.env.SENDER_EMAIL || "noreply@burnoutplatform.com",
    };
    sendSmtpEmail.to = [{ email }];

    // Log the final payload we are about to send (helpful for debugging)
    console.log("Assessment sendSmtpEmail payload:", {
      subject: sendSmtpEmail.subject,
      sender: sendSmtpEmail.sender,
      to: sendSmtpEmail.to,
      htmlLength: (sendSmtpEmail.htmlContent || "").length,
      textLength: (sendSmtpEmail.textContent || "").length,
    });

    // Send via Brevo (send in both dev and production if API key is configured)
    let emailResult;
    try {
      console.log(`📤 Attempting to send assessment email to: ${email}`);
      console.log(`📤 Environment: ${process.env.NODE_ENV}`);
      
      emailResult = await apiInstance.sendTransacEmail(sendSmtpEmail);
      
      console.log("✅ Email sent successfully!");
      console.log("📬 Brevo response:", {
        messageId: emailResult?.messageId,
        response: emailResult,
      });
      
      if (!emailResult?.messageId) {
        console.warn("⚠️ Warning: Email sent but no messageId returned from Brevo");
      }
    } catch (brevoError) {
      console.error("❌ Brevo API error while sending assessment:", brevoError);
      console.error("Error details:", {
        statusCode: brevoError.statusCode || brevoError.response?.status,
        message: brevoError.message,
        responseBody: brevoError.response?.body || brevoError.body,
        fullError: JSON.stringify(brevoError, Object.getOwnPropertyNames(brevoError)),
      });

      if (brevoError.statusCode === 401 || brevoError.response?.status === 401) {
        return NextResponse.json({ 
          error: "Email service authentication failed", 
          details: "Invalid Brevo API key. Please check your BREVO_API_KEY environment variable." 
        }, { status: 500 });
      }

      const errMsg = brevoError.response?.body?.message || brevoError.body?.message || brevoError.message || "Failed to send email";
      return NextResponse.json({ 
        error: "Failed to send email", 
        details: errMsg,
        debug: process.env.NODE_ENV === "development" ? {
          statusCode: brevoError.statusCode || brevoError.response?.status,
          responseBody: brevoError.response?.body || brevoError.body,
        } : undefined
      }, { status: 500 });
    }

    // Return success
    return NextResponse.json({
      success: true,
      message: "Assessment sent successfully",
      brevoMessageId: emailResult?.messageId || null,
      email,
    }, { status: 200 });

  } catch (err) {
    console.error("Unexpected error in assessment endpoint:", err);
    return NextResponse.json({ error: "Internal server error", details: err.message || String(err) }, { status: 500 });
  }
}
