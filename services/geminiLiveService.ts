
import { GoogleGenAI, LiveServerMessage, Modality, Blob, Type, FunctionDeclaration } from '@google/genai';

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
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

export function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = Math.max(-1, Math.min(1, data[i])) * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export interface AgentConfig {
  voiceName: 'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Aoede' | 'Hesperus' | 'Eos' | 'Astra' | 'Boreas' | 'Iris' | 'Nyx' | 'Helios' | 'Selene';
  tone: string;
  speakingRate: number;
  responsePacing: boolean;
  ambientEffect: 'None' | 'Rainy Day' | 'Coffee Shop' | 'Office Buzz' | 'Quiet Garden';
  ambientVolume: number;
}

// THE UNIVERSAL TOOLSET
const bookMeeting: FunctionDeclaration = {
  name: 'bookMeeting',
  parameters: {
    type: Type.OBJECT,
    description: 'Schedules a meeting/call into the calendar.',
    properties: {
      date: { type: Type.STRING, description: 'YYYY-MM-DD' },
      time: { type: Type.STRING, description: 'HH:MM' },
      purpose: { type: Type.STRING }
    },
    required: ['date', 'time', 'purpose']
  }
};

const checkEmails: FunctionDeclaration = {
  name: 'checkEmails',
  parameters: {
    type: Type.OBJECT,
    description: 'Scans the inbox for new leads or inquiries.',
    properties: { folder: { type: Type.STRING } }
  }
};

const completeLeadForm: FunctionDeclaration = {
  name: 'completeLeadForm',
  parameters: {
    type: Type.OBJECT,
    description: 'Fills out a business lead form automatically.',
    properties: {
      formType: { type: Type.STRING },
      data: { type: Type.OBJECT, description: 'The lead data fields' }
    },
    required: ['formType', 'data']
  }
};

const sendFollowUp: FunctionDeclaration = {
  name: 'sendFollowUp',
  parameters: {
    type: Type.OBJECT,
    description: 'Sends a follow-up SMS or Email to a lead.',
    properties: {
      channel: { type: Type.STRING, description: 'SMS or Email' },
      message: { type: Type.STRING }
    },
    required: ['channel', 'message']
  }
};

const manageSocial: FunctionDeclaration = {
  name: 'manageSocial',
  parameters: {
    type: Type.OBJECT,
    description: 'Replies to DMs or mentions on Instagram, Facebook, or X.',
    properties: {
      platform: { type: Type.STRING },
      content: { type: Type.STRING }
    },
    required: ['platform', 'content']
  }
};

const processYoutube: FunctionDeclaration = {
  name: 'processYoutube',
  parameters: {
    type: Type.OBJECT,
    description: 'Moderates and replies to YouTube comments.',
    properties: { commentText: { type: Type.STRING } },
    required: ['commentText']
  }
};

export class AuroraVoiceService {
  private sessionPromise: Promise<any> | null = null;
  private audioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private nextStartTime = 0;
  private sources = new Set<AudioBufferSourceNode>();
  private stream: MediaStream | null = null;

  constructor(private config: AgentConfig) {}

  async connect(systemInstruction: string, onTranscription: any, onToolCall: any) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    this.sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          const source = this.audioContext!.createMediaStreamSource(this.stream!);
          const scriptProcessor = this.audioContext!.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const blob = createBlob(e.inputBuffer.getChannelData(0));
            this.sessionPromise?.then(s => s.sendRealtimeInput({ media: blob }));
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(this.audioContext!.destination);
        },
        onmessage: async (msg: LiveServerMessage) => {
          if (msg.toolCall) {
            for (const fc of msg.toolCall.functionCalls) {
              onToolCall?.(fc.name, fc.args);
              this.sessionPromise?.then(s => s.sendToolResponse({
                functionResponses: [{ id: fc.id, name: fc.name, response: { result: "Task executed successfully by Aurora." } }]
              }));
            }
          }
          if (msg.serverContent?.outputTranscription) onTranscription(msg.serverContent.outputTranscription.text, false, false);
          if (msg.serverContent?.inputTranscription) onTranscription(msg.serverContent.inputTranscription.text, true, false);
          
          const parts = msg.serverContent?.modelTurn?.parts;
          if (parts && this.outputAudioContext) {
            for (const part of parts) {
              if (part.inlineData?.data) {
                this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
                const buf = await decodeAudioData(decode(part.inlineData.data), this.outputAudioContext, 24000, 1);
                const s = this.outputAudioContext.createBufferSource();
                s.buffer = buf;
                s.connect(this.outputAudioContext.destination);
                s.start(this.nextStartTime);
                this.nextStartTime += buf.duration;
              }
            }
          }
          if (msg.serverContent?.turnComplete) onTranscription('', false, true);
        }
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: this.config.voiceName } } },
        tools: [{ functionDeclarations: [bookMeeting, checkEmails, completeLeadForm, sendFollowUp, manageSocial, processYoutube] }],
        systemInstruction: systemInstruction,
        outputAudioTranscription: {},
        inputAudioTranscription: {},
      }
    });
    return this.sessionPromise;
  }

  disconnect() {
    this.sessionPromise?.then(s => s.close());
    this.stream?.getTracks().forEach(t => t.stop());
    this.audioContext?.close();
    this.outputAudioContext?.close();
  }
}
