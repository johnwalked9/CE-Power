import { 
  GoogleGenAI, 
  GenerateContentResponse, 
  Chat, 
  Type,
  LiveServerMessage,
  Modality
} from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

// Add global type for AI Studio key selection
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- Audio Utils for Live API ---
function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  let binary = '';
  const bytes = new Uint8Array(int16.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return {
    data: btoa(binary),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// --- Chat & Vision & Thinking & Search ---

export const sendMessage = async (
  history: Array<{role: 'user' | 'model', parts: any[]}>,
  message: string,
  imageParts: string[] = [], // base64 strings
  videoPart: { data: string, mimeType: string } | null = null,
  options: {
    useThinking?: boolean;
    useSearch?: boolean;
    useVideo?: boolean;
  }
): Promise<{text: string, groundingChunks?: any[]}> => {
  
  let model = 'gemini-3-pro-preview';
  if (options.useSearch) {
    model = 'gemini-3-flash-preview'; // Updated to latest model for search grounding
  }

  const config: any = {
    systemInstruction: SYSTEM_INSTRUCTION,
  };

  if (options.useThinking && !options.useSearch) {
    config.thinkingConfig = { thinkingBudget: 32768 };
    // DO NOT set maxOutputTokens when thinking is on, as per guidelines
  }

  if (options.useSearch) {
    config.tools = [{ googleSearch: {} }];
  }

  // Construct parts
  const currentParts: any[] = [];
  
  // Attach images
  imageParts.forEach(img => {
    currentParts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: img
      }
    });
  });

  // Attach video
  if (videoPart) {
    currentParts.push({
      inlineData: {
        mimeType: videoPart.mimeType,
        data: videoPart.data
      }
    });
    // Video understanding uses Pro model
    model = 'gemini-3-pro-preview';
  }

  currentParts.push({ text: message });

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: currentParts }
      ],
      config
    });

    return {
      text: response.text || "I couldn't generate a text response.",
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Sorry, I encountered an error communicating with the AI service." };
  }
};

// --- Image Generation (Nano Banana Pro) ---

export const generateImage = async (
  prompt: string, 
  size: '1K' | '2K' | '4K'
): Promise<string> => {
  const isPro = size !== '1K';
  // 1K default, upgrade for 2K/4K
  const model = isPro ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  // Handle API Key selection for paid models
  if (isPro && window.aistudio) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
    }
  }

  // Re-initialize client to pick up potentially new API key from environment
  const client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const config: any = {
      imageConfig: {
        aspectRatio: '1:1', // Default
      }
    };

    if (isPro) {
      config.imageConfig.imageSize = size;
    }

    // Enhance prompt to ensure image generation behavior (prevents text refusals)
    const enhancedPrompt = prompt.toLowerCase().includes('generate') 
      ? prompt 
      : `Generate an image of ${prompt}`;

    const response = await client.models.generateContent({
      model,
      contents: { parts: [{ text: enhancedPrompt }] },
      config
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    // If no image, check for text (error message from model)
    const textPart = response.text;
    if (textPart) {
      throw new Error(`Model Refusal: ${textPart}`);
    }

    throw new Error("No image generated (Unknown reason)");

  } catch (error: any) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

// --- Image Editing (Nano Banana) ---

export const editImage = async (
  imageBase64: string,
  prompt: string
): Promise<string> => {
  try {
    // Correctly parse MIME type and data from Data URL
    const match = imageBase64.match(/^data:(image\/[a-z]+);base64,(.+)$/);
    if (!match) {
      throw new Error("Invalid image data format. Expected Data URL.");
    }
    const mimeType = match[1];
    const data = match[2];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: data,
            },
          },
          { text: prompt },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    // If no image, check for text (error message from model)
    const textPart = response.text;
    if (textPart) {
      throw new Error(`Model Refusal: ${textPart}`);
    }
    
    throw new Error("No edited image returned");

  } catch (error: any) {
    console.error("Image Edit Error:", error);
    throw error;
  }
};

// --- Live API Connect ---

export interface LiveCallbacks {
  onAudioData: (base64: string) => void;
  onInterrupted: () => void;
  onClose: () => void;
}

export const connectLive = async (
  callbacks: LiveCallbacks
): Promise<{
  sendAudio: (data: Float32Array) => void;
  close: () => void;
}> => {
  
  const sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks: {
      onopen: () => console.log("Live Session Open"),
      onmessage: async (message: LiveServerMessage) => {
        const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          callbacks.onAudioData(base64Audio);
        }
        
        // Handle interruption (User barge-in)
        if (message.serverContent?.interrupted) {
          callbacks.onInterrupted();
        }
      },
      onclose: () => {
        console.log("Live Session Closed");
        callbacks.onClose();
      },
      onerror: (e) => console.error("Live Session Error", e),
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
      },
      // Instruction updated to ensure detailed explanations and greeting
      systemInstruction: SYSTEM_INSTRUCTION + " You are a live voice assistant. Listen carefully to the customer. When they describe their needs, explain in detail why a specific generator or pump is the best fit based on power, fuel, and use case. IMPORTANT: Start the conversation immediately with a gentle, short greeting like 'Welcome to CE Generator and Pump. How can I help you today?'",
    },
  });

  return {
    sendAudio: (data: Float32Array) => {
      const pcmBlob = createBlob(data);
      sessionPromise.then(session => {
        session.sendRealtimeInput({ media: pcmBlob });
      });
    },
    close: () => {
      sessionPromise.then(session => session.close());
    }
  };
};