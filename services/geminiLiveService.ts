
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
  voiceName: string;
  tone: string;
  speakingRate: number;
  responsePacing: boolean;
  ambientEffect: string;
  ambientVolume: number;
}

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

const sendEmailFollowUp: FunctionDeclaration = {
  name: 'sendEmailFollowUp',
  parameters: {
    type: Type.OBJECT,
    description: 'Dispatches an email follow-up sequence or specific document to a prospect.',
    properties: {
      recipientEmail: { type: Type.STRING },
      subject: { type: Type.STRING },
      body: { type: Type.STRING, description: 'The full HTML or text content of the email.' }
    },
    required: ['recipientEmail', 'subject', 'body']
  }
};

const sendSMSFollowUp: FunctionDeclaration = {
  name: 'sendSMSFollowUp',
  parameters: {
    type: Type.OBJECT,
    description: 'Sends a direct SMS/Text message for meeting confirmations or quick alerts.',
    properties: {
      phoneNumber: { type: Type.STRING },
      message: { type: Type.STRING }
    },
    required: ['phoneNumber', 'message']
  }
};

const sendSocialMessage: FunctionDeclaration = {
  name: 'sendSocialMessage',
  parameters: {
    type: Type.OBJECT,
    description: 'Replies to or initiates a message on social platforms (Instagram, Facebook, X).',
    properties: {
      platform: { type: Type.STRING, description: 'Must be "Instagram", "Facebook", or "X"' },
      recipientHandle: { type: Type.STRING, description: 'The social handle or user ID' },
      message: { type: Type.STRING }
    },
    required: ['platform', 'recipientHandle', 'message']
  }
};

const AMBIENT_SOUNDS: Record<string, string> = {
  'Coffee Shop': 'https://assets.mixkit.co/sfx/preview/mixkit-coffee-shop-ambience-with-people-and-clinking-cups-2715.mp3',
  'Rainy Day': 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-falling-on-leaves-2471.mp3',
  'Office Buzz': 'https://assets.mixkit.co/sfx/preview/mixkit-typing-on-computer-keyboard-1389.mp3',
  'Quiet Garden': 'https://assets.mixkit.co/sfx/preview/mixkit-forest-at-night-with-birds-and-wind-2470.mp3'
};

export class AuroraVoiceService {
  private sessionPromise: Promise<any> | null = null;
  private audioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private nextStartTime = 0;
  private stream: MediaStream | null = null;
  private ambientElement: HTMLAudioElement | null = null;

  constructor(private config: AgentConfig) {}

  async connect(systemInstruction: string, onTranscription: any, onToolCall: any) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    await this.audioContext.resume();
    await this.outputAudioContext.resume();

    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    if (this.config.ambientEffect !== 'None' && AMBIENT_SOUNDS[this.config.ambientEffect]) {
      this.ambientElement = new Audio(AMBIENT_SOUNDS[this.config.ambientEffect]);
      this.ambientElement.loop = true;
      this.ambientElement.volume = this.config.ambientVolume;
      this.ambientElement.play().catch(e => console.warn('Ambient autoplay blocked or failed', e));
    }

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
                functionResponses: { id: fc.id, name: fc.name, response: { result: "ok, tool executed successfully." } }
              }));
            }
          }
          if (msg.serverContent?.outputTranscription) onTranscription(msg.serverContent.outputTranscription.text, false, false);
          if (msg.serverContent?.inputTranscription) onTranscription(msg.serverContent.inputTranscription.text, true, false);
          
          const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audioData && this.outputAudioContext) {
            this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
            const buf = await decodeAudioData(decode(audioData), this.outputAudioContext, 24000, 1);
            const s = this.outputAudioContext.createBufferSource();
            s.buffer = buf;
            s.connect(this.outputAudioContext.destination);
            s.start(this.nextStartTime);
            this.nextStartTime += buf.duration;
          }
          
          if (msg.serverContent?.turnComplete) onTranscription('', false, true);
        },
        onerror: (e) => console.error('Live API Error:', e),
        onclose: () => console.log('Live session closed')
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: this.config.voiceName as any } } },
        tools: [{ functionDeclarations: [bookMeeting, completeLeadForm, sendEmailFollowUp, sendSMSFollowUp, sendSocialMessage] }],
        systemInstruction: systemInstruction,
        outputAudioTranscription: {},
        inputAudioTranscription: {},
      }
    });

    return this.sessionPromise;
  }

  updateAmbientVolume(volume: number) {
    if (this.ambientElement) {
      this.ambientElement.volume = volume;
    }
  }

  disconnect() {
    this.sessionPromise?.then(s => s.close());
    this.stream?.getTracks().forEach(t => t.stop());
    this.audioContext?.close();
    this.outputAudioContext?.close();
    if (this.ambientElement) {
      this.ambientElement.pause();
      this.ambientElement = null;
    }
  }
}
