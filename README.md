# Phone Assistant TTS Service

A high-quality text-to-speech service built for the [Personal Phone Assistant](https://github.com/mario-digital/personal_phone_assistant) project. This Vercel-deployed service provides ultra-realistic voice synthesis using ElevenLabs API, optimized for Twilio phone calls.

## 🎯 Purpose

This service acts as a bridge between the [Personal Phone Assistant](https://github.com/mario-digital/personal_phone_assistant) and ElevenLabs, providing:
- **High-quality voice synthesis** for natural phone conversations
- **Twilio-compatible audio format** (MP3)
- **Fast response times** with Vercel's edge network
- **Automatic scaling** to handle call volume spikes
- **Health monitoring** and status endpoints

**Note**: While designed for the Phone Assistant project, this service works standalone for any application needing ElevenLabs TTS integration.

## 🏗️ Architecture

```
Phone Call → Twilio Functions → TTS Service → ElevenLabs → Audio Response
```

The service receives text from Twilio Functions and returns audio that can be played directly in phone calls.

## 📁 Project Structure

```
phone-assistant-tts/
├── api/
│   ├── tts.js          # Main TTS endpoint
│   └── health.js       # Health check endpoint
├── package.json        # Dependencies (ElevenLabs only)
├── vercel.json         # Vercel configuration
└── README.md          # This file
```

**Note**: Environment variables are managed through Vercel CLI/Dashboard, not local files.

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/mario-digital/phone-assistant-tts.git
cd phone-assistant-tts
npm install
```

### 2. Configure Environment Variables

Set environment variables via Vercel CLI:

```bash
# Set your ElevenLabs API key
vercel env add ELEVENLABS_API_KEY

# Set voice ID (optional - has default)
vercel env add ELEVENLABS_VOICE_ID

# When prompted, enter:
# - Your ElevenLabs API key (sk_...)
# - Voice ID: pqHfZKP75CvOlQylNhV4 (or your preferred voice)
# - Select environments: Production, Preview, Development
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI if you haven't already
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### 4. Test the Deployment

```bash
# Test health endpoint
curl https://your-app.vercel.app/api/health

# Test TTS endpoint
curl "https://your-app.vercel.app/api/tts?text=Hello%20from%20ElevenLabs"
```

## 📡 API Endpoints

### `GET /api/tts`

Converts text to speech using ElevenLabs.

**Parameters:**
- `text` (required): Text to convert to speech

**Example:**
```bash
curl "https://your-app.vercel.app/api/tts?text=Hello%20world"
```

**Response:**
- **Content-Type**: `audio/mpeg`
- **Body**: MP3 audio file
- **Headers**: Optimized for Twilio compatibility

### `GET /api/health`

Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-05-28T10:30:00.000Z",
  "service": "TTS Server",
  "platform": "Vercel"
}
```

## ⚙️ Configuration

### Environment Variables

Environment variables are managed through Vercel (no local `.env` files in production):

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `ELEVENLABS_API_KEY` | Your ElevenLabs API key | - | ✅ |
| `ELEVENLABS_VOICE_ID` | Voice ID from ElevenLabs | `pqHfZKP75CvOlQylNhV4` | ❌ |

**Set via Vercel CLI:**
```bash
vercel env add ELEVENLABS_API_KEY
vercel env add ELEVENLABS_VOICE_ID
```

### Voice Configuration

The service uses optimized settings for phone calls:

```javascript
voice_settings: {
  stability: 0.6,         // Balanced stability
  similarity_boost: 0.7,  // Good quality with speed
  style: 0.0,            // Neutral style
  use_speaker_boost: false // Disabled for faster processing
}
```

### Vercel Configuration

The `vercel.json` configures:
- **Function timeout**: 30 seconds for TTS generation
- **URL rewrites**: Clean API routes
- **Edge optimization**: Fast global response times

## 🧪 Development

### Local Development

For local development, you can create a `.env.local` file:

```bash
# Create .env.local for local development only
ELEVENLABS_API_KEY=sk_your_key_here
ELEVENLABS_VOICE_ID=pqHfZKP75CvOlQylNhV4

# Start development server
npm run dev

# The service will be available at http://localhost:3000
```

**Important**: The `.env.local` file is only for local development. Production uses Vercel environment variables.

### Testing Locally

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test TTS with sample text
curl "http://localhost:3000/api/tts?text=Testing%20local%20development"
```

### Integration with Phone Assistant

When developing locally with the main [Personal Phone Assistant](https://github.com/mario-digital/personal_phone_assistant) project, update its environment:

```bash
# In the main phone assistant project
TTS_MODE=local
LOCAL_TTS_URL=http://localhost:3000
```

## 🔧 Troubleshooting

### Common Issues

**"Audio generation failed" errors:**
- Verify your ElevenLabs API key is valid
- Check your ElevenLabs account has sufficient credits
- Ensure the voice ID exists in your account

**Slow response times:**
- ElevenLabs generation typically takes 1-3 seconds
- Vercel functions have a 30-second timeout
- Consider shorter text inputs for faster generation

**"Method not allowed" errors:**
- The TTS endpoint only accepts GET requests
- Ensure your request format matches the examples

### Monitoring

**Vercel Dashboard:**
- View function logs and performance metrics
- Monitor error rates and response times
- Check deployment status and builds

**ElevenLabs Dashboard:**
- Monitor API usage and costs
- Check character consumption
- View voice generation history

### Debug Commands

```bash
# Test with verbose output
curl -v "https://your-app.vercel.app/api/tts?text=Debug%20test"

# Check response headers
curl -I "https://your-app.vercel.app/api/health"

# Test with long text (should work under 30s)
curl "https://your-app.vercel.app/api/tts?text=This%20is%20a%20longer%20text%20to%20test%20generation%20time"
```

## 💰 Cost Management

### ElevenLabs Pricing

- **Characters**: ~$0.18 per 1,000 characters
- **Typical conversation**: 50-500 characters per response
- **Monthly estimate**: $5-50 depending on call volume

### Vercel Pricing

- **Function executions**: 100K free per month
- **Bandwidth**: 1TB free per month
- **Typical usage**: Well within free tier limits

### Optimization Tips

1. **Shorter responses**: Keep AI responses concise
2. **Voice settings**: Current settings balance quality and speed
3. **Caching**: Vercel automatically caches responses
4. **Monitoring**: Set up alerts for high usage

## 🔒 Security

### API Security

- **No authentication required**: Service is stateless and safe for public access
- **Rate limiting**: Handled by Vercel's built-in protection  
- **Input validation**: Text input is URL-encoded and validated

### Environment Variables

- **Vercel-managed**: All secrets stored securely in Vercel
- **No local files**: Production doesn't use `.env` files
- **Key rotation**: Update via Vercel dashboard or CLI

## 📊 Performance

### Benchmarks

- **Cold start**: ~500ms (Vercel optimization)
- **TTS generation**: 1-3 seconds (ElevenLabs processing)
- **Audio delivery**: ~100ms (edge caching)
- **Total latency**: 2-4 seconds typical

### Optimization

The service is optimized for:
- **Fast startup**: Minimal dependencies
- **Efficient generation**: Balanced voice settings
- **Edge delivery**: Vercel's global CDN
- **Automatic scaling**: Handles traffic spikes

## 🚀 Deployment

### Production Deployment

```bash
# Deploy to production
vercel --prod

# Set environment variables via Vercel dashboard or CLI
vercel env add ELEVENLABS_API_KEY production
vercel env add ELEVENLABS_VOICE_ID production
```

### Environment Setup

1. **Vercel Dashboard**: Go to your project settings
2. **Environment Variables**: Add your ElevenLabs credentials
3. **Redeploy**: Trigger a new deployment to apply changes

### Custom Domains

```bash
# Add custom domain (optional)
vercel domains add tts.yourdomain.com
```

## 🔄 Integration

### With Personal Phone Assistant

This service is the TTS component for the [Personal Phone Assistant](https://github.com/mario-digital/personal_phone_assistant). Update the main project's environment variables:

```bash
# Production setup in main project
TTS_MODE=vercel
VERCEL_TTS_URL=https://your-tts-app.vercel.app
```

### API Usage in Phone Assistant

```javascript
// Example usage in the main project's conversation.js
const audioUrl = `${baseUrl}/api/tts?text=${encodeURIComponent(text)}`;
twiml.play(audioUrl);
```

### Standalone Usage

This service can also be used independently for any TTS needs:

```javascript
// Direct API call from any application
const response = await fetch(`https://your-tts-app.vercel.app/api/tts?text=${encodeURIComponent('Hello world')}`);
const audioBuffer = await response.arrayBuffer();
// Use audioBuffer as needed
```

## 🎨 Customization

### Voice Selection

1. **Browse voices**: [ElevenLabs Voice Library](https://elevenlabs.io/voice-library)
2. **Copy voice ID**: From the voice page
3. **Update environment**: Set `ELEVENLABS_VOICE_ID`
4. **Redeploy**: Changes take effect immediately

### Voice Settings

Modify settings in `api/tts.js` for different characteristics:

```javascript
voice_settings: {
  stability: 0.8,         // Higher = more consistent
  similarity_boost: 0.9,  // Higher = more like original
  style: 0.3,            // Higher = more expressive
  use_speaker_boost: true // Enable for clarity
}
```

## 📈 Monitoring & Analytics

### Vercel Analytics

- **Function invocations**: Track usage patterns
- **Response times**: Monitor performance
- **Error rates**: Identify issues quickly
- **Bandwidth usage**: Track data transfer

### Custom Monitoring

```javascript
// Add to your functions for custom tracking
console.log(`TTS generated: ${text.length} characters`);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/improvement`
3. Make your changes and test locally
4. Update documentation if needed
5. Submit a pull request

### Development Guidelines

- **Keep it simple**: This service has one job - TTS
- **Optimize for speed**: Phone calls need quick responses
- **Handle errors gracefully**: Always provide fallback responses
- **Log important events**: For debugging and monitoring

## 📞 Support

For issues specific to the TTS service:

1. **Check Vercel logs**: Function execution details
2. **Verify ElevenLabs**: API key and credits
3. **Test endpoints**: Use curl commands above
4. **Open an issue**: Include logs and error details

For integration issues, check the [main project repository](https://github.com/mario-digital/personal_phone_assistant).

## 🔗 Related Projects

- **Main Phone Assistant**: [mario-digital/personal_phone_assistant](https://github.com/mario-digital/personal_phone_assistant)
- **ElevenLabs API**: [Official Documentation](https://docs.elevenlabs.io/)
- **Vercel Functions**: [Documentation](https://vercel.com/docs/functions)

---

**Built for seamless voice experiences** 🎙️

> This service is designed to work with the Personal Phone Assistant but can be used standalone for any TTS needs requiring ElevenLabs integration.