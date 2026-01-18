# Email Setup Instructions

## Step 1: Create Gmail App Password

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable it if not already enabled)
3. Go to **App passwords**: https://myaccount.google.com/apppasswords
4. Select **Mail** and **Other (Custom name)**, enter "Website Booking Form"
5. Click **Generate**
6. Copy the 16-character app password (you'll need this for the .env file)

## Step 2: Create .env File

Create a `.env` file in the root directory with the following:

```
GMAIL_USER=podverse.uae@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password_here
PORT=3001
```

**Important:** Replace `your_16_character_app_password_here` with the actual app password from Step 1.

## Step 3: Run the Application

### Option A: Run both servers together (Recommended)
```bash
npm run dev:all
```

This will start both the Express server (port 3001) and the Vite dev server (port 3000).

### Option B: Run servers separately

Terminal 1 - Start the Express server:
```bash
npm run server
```

Terminal 2 - Start the Vite dev server:
```bash
npm run dev
```

## Step 4: Test the Form

1. Open your browser to `http://localhost:3000`
2. Navigate to the Book page
3. Fill out the booking form
4. Click "Submit Request"
5. Check your Gmail inbox (podverse.uae@gmail.com) for the booking request email

## Troubleshooting

- **"Email sending error"**: Check that your GMAIL_APP_PASSWORD is correct and that you're using an App Password (not your regular Gmail password)
- **"Cannot connect to server"**: Make sure the Express server is running on port 3001
- **CORS errors**: The Vite proxy should handle this automatically in development

## Production Deployment

For production, you'll need to:
1. Set up environment variables on your hosting platform
2. Deploy the Express server (or use a serverless function)
3. Update the API URL in `App.tsx` if needed
