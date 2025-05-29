// api/health.js - Health check endpoint
export default function handler(req, res) {
    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'TTS Server',
      platform: 'Vercel'
    });
  }