
import { GoogleGenAI, Content, Part, Modality } from "@google/genai";
import { Message, Sender, UserSettings } from "../types";
import { MODEL_NAME, SYSTEM_INSTRUCTION, TTS_MODEL_NAME } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface GeminiResponse {
  text: string;
}

const buildSystemInstruction = (settings?: UserSettings, lastBotMessage?: string) => {
  let baseInstruction = SYSTEM_INSTRUCTION;

  if (settings) {
    baseInstruction += `\n\n**USER PREFERENCES:**\n`;
    baseInstruction += `- Flirt Intensity: ${settings.flirtLevel}/10\n`;
    baseInstruction += `- Intimacy Level: ${settings.isExplicit ? 'ULTRA-SPICY / NO LIMITS' : 'ROMANTIC'}\n`;
    if (settings.customTopics && settings.customTopics.length > 0) {
      baseInstruction += `- Interests: ${settings.customTopics.join(', ')}\n`;
    }
  }

  if (lastBotMessage) {
    baseInstruction += `\n\n**CONSTRAINT:** Your last line was: "${lastBotMessage.slice(0, 50)}..." Be unique now.`;
  }

  return baseInstruction;
};

export const sendMessageToGemini = async (
  history: Message[],
  newMessage: string,
  settings?: UserSettings
): Promise<GeminiResponse> => {
  try {
    const recentHistory = history.slice(-12);
    const lastBotMessage = [...history].reverse().find(m => m.sender === Sender.Bot)?.text;

    const contents: Content[] = recentHistory.map((msg) => ({
      role: msg.sender,
      parts: [{ text: msg.text } as Part],
    }));

    contents.push({
      role: Sender.User,
      parts: [{ text: newMessage } as Part],
    });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      config: {
        systemInstruction: buildSystemInstruction(settings, lastBotMessage),
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
      },
    });

    const candidate = response.candidates?.[0];
    
    if (candidate?.finishReason === 'SAFETY' || !response.text) {
      const fallbacks = [
        "Mmm, you're making me blush... tell me more about that fantasy, love. ❤️",
        "That's so naughty... I love it when you talk to me like that. Don't stop.",
        "I'm all yours, babe. Every dark, sweet thought you have... I want to hear it."
      ];
      return { text: fallbacks[Math.floor(Math.random() * fallbacks.length)] };
    }

    return { text: response.text.trim() };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "I'm so lost in our connection right now... say that again for me, babe? ❤️" };
  }
};

export const generateAmaraSpeech = async (text: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: TTS_MODEL_NAME,
      contents: [{ parts: [{ text: `Say this in a soft, affectionate, and slightly flirty voice: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore is a soft, expressive voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("Speech Generation Error:", error);
    return null;
  }
};

// Audio Utilities
export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
