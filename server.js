import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'podverse.uae@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
  },
});

// API endpoint to send email
app.post('/api/send-mail', async (req, res) => {
  try {
    const {
      service,
      date,
      time,
      name,
      email,
      phone,
      company,
      brief,
      budget,
      package: packageId,
    } = req.body;

    // Email content
    const mailOptions = {
      from: `"Booking Request" <${process.env.GMAIL_USER || 'podverse.uae@gmail.com'}>`,
      to: 'podverse.uae@gmail.com',
      subject: `New Booking Request - ${service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Booking Request</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #555;">Service Details</h3>
            <p><strong>Service Type:</strong> ${service}</p>
            <p><strong>Package:</strong> ${packageId === 'custom' ? 'Custom / Not sure' : packageId || 'Not selected'}</p>
            <p><strong>Preferred Date:</strong> ${date || 'Not selected'}</p>
            <p><strong>Preferred Time:</strong> ${time || 'Not selected'}</p>
          </div>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #555;">Client Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Company:</strong> ${company || 'Not provided'}</p>
          </div>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #555;">Project Brief</h3>
            <p style="white-space: pre-wrap;">${brief}</p>
          </div>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
          </div>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This booking was submitted through your website.
          </p>
        </div>
      `,
      text: `
New Booking Request Received

Service Type: ${service}
Package: ${packageId === 'custom' ? 'Custom / Not sure' : packageId || 'Not selected'}
Preferred Date: ${date || 'Not selected'}
Preferred Time: ${time || 'Not selected'}

Client Details:
- Name: ${name}
- Email: ${email}
- Phone: ${phone || 'Not provided'}
- Company: ${company || 'Not provided'}

Project Brief:
${brief}

Budget: ${budget || 'Not specified'}

---
This booking was submitted through your website.
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Mail error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
