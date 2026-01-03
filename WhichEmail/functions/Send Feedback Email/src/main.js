import { Client, Databases } from 'node-appwrite';
import nodemailer from 'nodemailer';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  try {
    // Parse the incoming request
    const payload = JSON.parse(req.body || '{}');
    
    log('Received feedback:', payload);

    const { rating, feedback, email, userName, userId } = payload;

    // Configure email transporter (using Gmail as example)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASS, // app password (not regular password)
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFICATION_EMAIL, // Your email where you want to receive feedback
      subject: `⭐ New Feedback - ${rating} Stars - WhichEmail`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    
    <!-- Header with gradient -->
    <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
        WhichEmail
      </h1>
      <p style="color: #bfdbfe; margin: 8px 0 0 0; font-size: 14px; font-weight: 500;">
        User Feedback System
      </p>
    </div>

    <!-- Main Content -->
    <div style="padding: 40px 30px;">
      
      <!-- Greeting -->
      <p style="font-size: 16px; color: #0f172a; margin: 0 0 8px 0; font-weight: 600;">
        Hey Fanyi Charllson! 👋
      </p>
      <p style="font-size: 14px; color: #64748b; margin: 0 0 30px 0; line-height: 1.6;">
        You just received new feedback on WhichEmail. Someone's vibing with your work! 🚀
      </p>

      <!-- Rating Card -->
      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 24px; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        <div style="text-align: center; margin-bottom: 12px;">
          <span style="font-size: 40px; letter-spacing: 4px;">
            ${'⭐'.repeat(rating)}
          </span>
        </div>
        <p style="text-align: center; margin: 0; font-size: 18px; font-weight: 700; color: #92400e;">
          ${rating} out of 5 stars
        </p>
        ${rating >= 4 ? `
          <p style="text-align: center; margin: 8px 0 0 0; font-size: 13px; color: #b45309; font-weight: 500;">
            🔥 They're loving it!
          </p>
        ` : ''}
      </div>

      <!-- User Info Card -->
      <div style="background: #f1f5f9; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #3b82f6;">
        <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">
          User Details
        </p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #475569; font-weight: 600;">Username:</td>
            <td style="padding: 8px 0; font-size: 14px; color: #0f172a; text-align: right;">${userName || 'Anonymous User'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #475569; font-weight: 600;">User ID:</td>
            <td style="padding: 8px 0; font-size: 14px; color: #0f172a; text-align: right; font-family: 'Courier New', monospace;">${userId}</td>
          </tr>
          ${email ? `
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #475569; font-weight: 600;">Email:</td>
            <td style="padding: 8px 0; font-size: 14px; color: #3b82f6; text-align: right;">
              <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
            </td>
          </tr>
          ` : ''}
        </table>
      </div>

      ${feedback ? `
      <!-- Feedback Message Card -->
      <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <div style="display: flex; align-items: center; margin-bottom: 16px;">
          <div style="background: #3b82f6; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
            <span style="font-size: 18px;">💬</span>
          </div>
          <p style="margin: 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #475569;">
            Their Thoughts
          </p>
        </div>
        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 3px solid #3b82f6;">
          <p style="margin: 0; font-size: 15px; color: #1e293b; line-height: 1.7; font-style: italic;">
            "${feedback}"
          </p>
        </div>
      </div>
      ` : ''}

      <!-- Motivational Footer -->
      <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 24px; text-align: center; margin-top: 32px;">
        <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #0c4a6e;">
          Keep Building. Keep Shipping. 💪
        </p>
        <p style="margin: 0; font-size: 13px; color: #0369a1; line-height: 1.5;">
          Every feedback brings you closer to creating something legendary.<br/>
          <strong style="color: #075985;">Software Architect Mode: Activated ⚡</strong>
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="background: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8; font-weight: 600;">
        WhichEmail Feedback System
      </p>
      <p style="margin: 0; font-size: 11px; color: #cbd5e1;">
        Sent on ${new Date().toLocaleString('en-US', { 
          weekday: 'short', 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
    </div>

  </div>
</body>
</html>
`,  
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    log('Email sent successfully!');

    return res.json({
      success: true,
      message: 'Feedback email sent successfully',
    });

  } catch (err) {
    error('Error sending email:', err);
    return res.json({
      success: false,
      error: err.message,
    }, 500);
  }
};