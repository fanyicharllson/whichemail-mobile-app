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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">New Feedback Received! 🎉</h2>
          
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Rating:</strong> ${'⭐'.repeat(rating)} (${rating}/5)</p>
            <p><strong>User:</strong> ${userName || 'Anonymous'}</p>
            <p><strong>User ID:</strong> ${userId}</p>
            ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
          </div>
          
          ${feedback ? `
            <div style="background: white; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0;">
              <h3 style="margin-top: 0;">Feedback Message:</h3>
              <p style="line-height: 1.6;">${feedback}</p>
            </div>
          ` : ''}
          
          <p style="color: #64748b; font-size: 12px; margin-top: 30px;">
            Sent from WhichEmail Feedback System
          </p>
        </div>
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