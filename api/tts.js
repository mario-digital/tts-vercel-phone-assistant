// api/tts.js - Vercel serverless function
const { ElevenLabsClient } = require('elevenlabs');

// Initialize ElevenLabs client
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
});

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const text = req.query.text || 'Hello from ElevenLabs!';
    console.log('Generating TTS for:', text);

    // Generate ElevenLabs audio
    const voiceId = process.env.ELEVENLABS_VOICE_ID || "pqHfZKP75CvOlQylNhV4";
    
    const audioBuffer = await elevenlabs.generate({
      voice: voiceId,
      text: text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.6,         // ✅ Slightly higher for faster generation
        similarity_boost: 0.7,  // ✅ Slightly lower for speed
        style: 0.0,
        use_speaker_boost: false // ✅ Disable for faster processing
      }
    });

    // Convert stream to buffer if needed
    let finalBuffer;
    if (audioBuffer instanceof Buffer) {
      finalBuffer = audioBuffer;
    } else {
      // If it's a stream, collect the chunks
      const chunks = [];
      for await (const chunk of audioBuffer) {
        chunks.push(chunk);
      }
      finalBuffer = Buffer.concat(chunks);
    }

    // Set headers specifically for Twilio compatibility
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', finalBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    console.log(`Audio generated successfully, size: ${finalBuffer.length} bytes`);
    
    // Send the audio buffer
    res.status(200).send(finalBuffer);

  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({ 
      error: 'Audio generation failed',
      message: error.message 
    });
  }
}