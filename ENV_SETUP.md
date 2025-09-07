# Environment Variables Setup

This project uses environment variables to securely manage API keys and configuration.

## Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Update the API keys in `.env.local`:**
   - Replace `sk_your_elevenlabs_api_key_here` with your actual ElevenLabs API key
   - Replace `gsk_your_groq_api_key_here` with your actual GROQ API key
   - Replace `sk_your_openai_api_key_here` with your actual OpenAI API key

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

## Environment Variables

### Frontend (.env.local)
- `REACT_APP_ELEVEN_LABS_API_KEY`: Your ElevenLabs API key for text-to-speech
- `REACT_APP_ELEVEN_LABS_VOICE_ID`: ElevenLabs voice ID (default: M563YhMmA0S8vEYwkgYa)
- `REACT_APP_GROQ_API_KEY`: Your GROQ API key for AI responses
- `REACT_APP_OPENAI_API_KEY`: Your OpenAI API key for AI responses
- `REACT_APP_API_BASE_URL`: Backend API URL (default: http://localhost:5000)

### Backend (backend/config.env)
- `JWT_SECRET`: Secret key for JWT token signing
- `MONGODB_URI`: MongoDB connection string
- `STRIPE_SECRET_KEY`: Stripe secret key for payments
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `CLOUDINARY_API_KEY`: Cloudinary API key for file uploads
- `SENDGRID_API_KEY`: SendGrid API key for emails

## Security Notes

- Never commit `.env.local` or `backend/config.env` to version control
- The `.gitignore` file is configured to exclude these files
- Use `.env.example` files as templates for other developers
- Rotate API keys regularly for security

## API Key Sources

- **ElevenLabs**: https://elevenlabs.io/
- **GROQ**: https://console.groq.com/
- **OpenAI**: https://platform.openai.com/
- **Stripe**: https://dashboard.stripe.com/
- **Cloudinary**: https://cloudinary.com/
- **SendGrid**: https://sendgrid.com/
