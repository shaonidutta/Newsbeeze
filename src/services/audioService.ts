// Audio generation service using text-to-speech
// Note: This is a simplified implementation. In production, you would integrate with
// the actual coqui/xtts-v2 model or a similar voice cloning service.

export const generateAudio = async (text: string): Promise<string> => {
  try {
    // Simulate API call delay for realistic experience
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // For demo purposes, we'll use the Web Speech API for text-to-speech
    // In production, you would call the coqui/xtts-v2 API or similar service

    if ("speechSynthesis" in window) {
      return await generateWebSpeechAudio(text);
    } else {
      throw new Error("Speech synthesis not supported in this browser");
    }
  } catch (error) {
    console.error("Error generating audio:", error);
    throw error;
  }
};

const generateWebSpeechAudio = async (text: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(text);

      // Configure voice settings for a more pleasant experience
      utterance.rate = 0.9; // Slightly slower than default
      utterance.pitch = 1.1; // Slightly higher pitch
      utterance.volume = 1.0;

      // Try to use a more natural voice if available
      const voices = speechSynthesis.getVoices();
      const preferredVoices = voices.filter(
        (voice) =>
          voice.lang.startsWith("en") &&
          (voice.name.includes("Google") ||
            voice.name.includes("Microsoft") ||
            voice.name.includes("Natural"))
      );

      if (preferredVoices.length > 0) {
        utterance.voice = preferredVoices[0];
      }

      // For the demo, we'll create a data URL that represents the audio
      // In a real implementation, this would be the actual audio file from the TTS service
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Create a simple tone as a placeholder for the actual audio
      const duration = Math.max(text.length * 0.1, 3); // Estimate duration based on text length
      const sampleRate = audioContext.sampleRate;
      const numSamples = duration * sampleRate;
      const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
      const channelData = buffer.getChannelData(0);

      // Generate a simple audio representation (in reality, this would be the TTS output)
      for (let i = 0; i < numSamples; i++) {
        channelData[i] =
          Math.sin((2 * Math.PI * 440 * i) / sampleRate) *
          0.1 *
          Math.exp(-i / (sampleRate * 2));
      }

      // Convert to WAV format (simplified)
      const audioBlob = bufferToWave(buffer, numSamples);
      const audioUrl = URL.createObjectURL(audioBlob);

      // For the actual speech, we'll still use the Web Speech API
      utterance.onend = () => {
        resolve(audioUrl);
      };

      utterance.onerror = (event) => {
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      // Start speaking (this won't be heard, but triggers the completion)
      speechSynthesis.speak(utterance);

      // For demo purposes, resolve immediately with a placeholder audio
      setTimeout(() => {
        speechSynthesis.cancel(); // Stop the actual speech
        resolve(audioUrl);
      }, 1000);
    } catch (error) {
      reject(error);
    }
  });
};

// Helper function to convert AudioBuffer to WAV blob
const bufferToWave = (abuffer: AudioBuffer, len: number): Blob => {
  const numOfChan = abuffer.numberOfChannels;
  const length = len * numOfChan * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);
  const channels = [];
  let sample;
  let offset = 0;
  let pos = 0;

  // Write WAV header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(abuffer.sampleRate);
  setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit (hardcoded in this demo)
  setUint32(0x61746164); // "data" - chunk
  setUint32(length - pos - 4); // chunk length

  // Write interleaved data
  for (let i = 0; i < abuffer.numberOfChannels; i++) {
    channels.push(abuffer.getChannelData(i));
  }

  while (pos < length) {
    for (let i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
      view.setInt16(pos, sample, true); // write 16-bit sample
      pos += 2;
    }
    offset++; // next source sample
  }

  function setUint16(data: number) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data: number) {
    view.setUint32(pos, data, true);
    pos += 4;
  }

  return new Blob([buffer], { type: "audio/wav" });
};

// Celebrity voice configurations (for future implementation with actual voice cloning)
export const CELEBRITY_VOICES = {
  "morgan-freeman": {
    name: "Morgan Freeman",
    description: "Deep, authoritative voice perfect for news narration",
  },
  "david-attenborough": {
    name: "David Attenborough",
    description: "Calm, educational tone ideal for nature and science news",
  },
  "oprah-winfrey": {
    name: "Oprah Winfrey",
    description: "Warm, engaging voice great for human interest stories",
  },
};

// Function to generate audio with specific celebrity voice (placeholder for future implementation)
export const generateCelebrityAudio = async (
  text: string,
  voiceId: string
): Promise<string> => {
  // This would integrate with coqui/xtts-v2 or similar voice cloning service
  // For now, fall back to regular audio generation
  console.log(
    `Generating audio with ${voiceId} voice for: ${text.substring(0, 50)}...`
  );
  return generateAudio(text);
};
