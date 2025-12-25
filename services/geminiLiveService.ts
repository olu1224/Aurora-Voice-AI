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
  const byteLength = data.byteLength;
  const frameCount = byteLength / (2 * numChannels);
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  const dv = new DataView(data.buffer, data.byteOffset, byteLength);
  
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      const sample = dv.getInt16(i * 2 * numChannels + channel * 2, true);
      channelData[i] = sample / 32768.0;
    }
  }
  return buffer;
}

export function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    const sample = isNaN(data[i]) ? 0 : Math.max(-1, Math.min(1, data[i]));
    int16[i] = sample * 32767;
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
  ambientEnabled?: boolean;
}

const triggerNurtureSequence: FunctionDeclaration = {
  name: 'triggerNurtureSequence',
  parameters: {
    type: Type.OBJECT,
    description: 'Triggers a multi-stage automated follow-up sequence for the lead.',
    properties: {
      sequenceType: { 
        type: Type.STRING, 
        description: 'Choice of: "Hot_Lead_Closer", "Warm_Education_Drip", "Meeting_Confirmation_Armor"' 
      },
      leadSentiment: { type: Type.STRING, description: 'The overall sentiment of the caller.' }
    },
    required: ['sequenceType']
  }
};

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

const sendEmailFollowUp: FunctionDeclaration = {
  name: 'sendEmailFollowUp',
  parameters: {
    type: Type.OBJECT,
    description: 'Dispatches a direct email follow-up.',
    properties: {
      recipientEmail: { type: Type.STRING },
      subject: { type: Type.STRING },
      body: { type: Type.STRING }
    },
    required: ['recipientEmail', 'subject', 'body']
  }
};

const sendSMSFollowUp: FunctionDeclaration = {
  name: 'sendSMSFollowUp',
  parameters: {
    type: Type.OBJECT,
    description: 'Sends a direct SMS follow-up.',
    properties: {
      phoneNumber: { type: Type.STRING },
      message: { type: Type.STRING }
    },
    required: ['phoneNumber', 'message']
  }
};

const AMBIENT_SOUNDS: Record<string, string> = {
  'Coffee Shop Ambience': 'https://assets.mixkit.co/sfx/preview/mixkit-coffee-shop-ambience-with-people-and-clinking-cups-2715.mp3',
  'Rainy Day': 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-falling-on-leaves-2471.mp3',
  'Office Buzz': 'https://assets.mixkit.co/sfx/preview/mixkit-typing-on-computer-keyboard-1389.mp3',
  'Quiet Garden': 'https://assets.mixkit.co/sfx/preview/mixkit-forest-at-night-with-birds-and-wind-2470.mp3'
};

export class AuroraVoiceService {
  private sessionPromise: Promise<any> | null = null;
  private audioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private outputNode: GainNode | null = null;
  private nextStartTime = 0;
  private stream: MediaStream | null = null;
  private ambientElement: HTMLAudioElement | null = null;
  private sources = new Set<AudioBufferSourceNode>();
  private scriptProcessor: ScriptProcessorNode | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;

  constructor(private config: AgentConfig) {}

  async connect(systemInstruction: string, onTranscription: any, onToolCall: any) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    this.outputNode = this.outputAudioContext.createGain();
    this.outputNode.connect(this.outputAudioContext.destination);
    
    await this.audioContext.resume();
    await this.outputAudioContext.resume();
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    if (this.config.ambientEnabled && this.config.ambientEffect !== 'None') this.playAmbient();

    const enhancedInstruction = `${systemInstruction}
      AUTOMATION PROTOCOLS:
      1. If user confirms a meeting: Use bookMeeting AND triggerNurtureSequence("Meeting_Confirmation_Armor").
      2. If user is highly interested but wants to "think about it": Use triggerNurtureSequence("Hot_Lead_Closer").
      3. If user wants more info or educational materials: Use triggerNurtureSequence("Warm_Education_Drip").
      Be conversational. Do not sound robotic when mentioning automations.`;

    const currentSessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          this.micSource = this.audioContext!.createMediaStreamSource(this.stream!);
          this.scriptProcessor = this.audioContext!.createScriptProcessor(4096, 1, 1);
          this.scriptProcessor.onaudioprocess = (e) => {
            const blob = createBlob(e.inputBuffer.getChannelData(0));
            currentSessionPromise.then(s => { try { s.sendRealtimeInput({ media: blob }); } catch(err) {} });
          };
          this.micSource.connect(this.scriptProcessor);
          this.scriptProcessor.connect(this.audioContext!.destination);
        },
        onmessage: async (msg: LiveServerMessage) => {
          if (msg.serverContent?.interrupted) {
            for (const source of this.sources.values()) try { source.stop(); } catch(e) {}
            this.sources.clear();
            this.nextStartTime = 0;
            return;
          }
          if (msg.toolCall) {
            for (const fc of msg.toolCall.functionCalls) {
              onToolCall?.(fc.name, fc.args);
              currentSessionPromise.then(s => s.sendToolResponse({
                functionResponses: { id: fc.id, name: fc.name, response: { result: "ok" } }
              }));
            }
          }
          if (msg.serverContent?.outputTranscription) onTranscription(msg.serverContent.outputTranscription.text, false, false);
          if (msg.serverContent?.inputTranscription) onTranscription(msg.serverContent.inputTranscription.text, true, false);
          
          const parts = msg.serverContent?.modelTurn?.parts || [];
          for (const part of parts) {
            if (part.inlineData?.data && this.outputAudioContext && this.outputNode) {
              this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
              const decodedData = decode(part.inlineData.data);
              const buf = await decodeAudioData(decodedData, this.outputAudioContext, 24000, 1);
              const s = this.outputAudioContext.createBufferSource();
              s.buffer = buf;
              s.connect(this.outputNode);
              s.addEventListener('ended', () => this.sources.delete(s));
              s.start(this.nextStartTime);
              this.sources.add(s);
              this.nextStartTime += buf.duration;
            }
          }
          if (msg.serverContent?.turnComplete) onTranscription('', false, true);
        },
        onclose: () => console.debug('Session closed.')
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: this.config.voiceName as any } } },
        tools: [{ functionDeclarations: [bookMeeting, triggerNurtureSequence, sendEmailFollowUp, sendSMSFollowUp] }],
        systemInstruction: enhancedInstruction,
        outputAudioTranscription: {},
        inputAudioTranscription: {},
      }
    });

    this.sessionPromise = currentSessionPromise;
    return this.sessionPromise;
  }

  private playAmbient() {
    if (this.ambientElement) this.ambientElement.pause();
    const url = AMBIENT_SOUNDS[this.config.ambientEffect];
    if (url) {
      try {
        this.ambientElement = new Audio(url);
        this.ambientElement.loop = true;
        this.ambientElement.volume = this.config.ambientVolume;
        this.ambientElement.play().catch(() => {});
      } catch (e) {}
    }
  }

  updateAmbient(effect: string, volume: number, enabled: boolean) {
    this.config.ambientEffect = effect;
    this.config.ambientVolume = volume;
    this.config.ambientEnabled = enabled;
    if (!enabled || effect === 'None') {
      if (this.ambientElement) { this.ambientElement.pause(); this.ambientElement = null; }
    } else {
      if (!this.ambientElement || this.ambientElement.src !== AMBIENT_SOUNDS[effect]) this.playAmbient();
      else this.ambientElement.volume = volume;
    }
  }

  disconnect() {
    this.sessionPromise?.then(s => { try { s.close(); } catch(e) {} });
    if (this.stream) this.stream.getTracks().forEach(t => t.stop());
    if (this.micSource) this.micSource.disconnect();
    if (this.scriptProcessor) this.scriptProcessor.disconnect();
    this.audioContext?.close();
    this.outputAudioContext?.close();
    if (this.ambientElement) { this.ambientElement.pause(); this.ambientElement = null; }
    for (const source of this.sources.values()) try { source.stop(); } catch(e) {}
    this.sources.clear();
  }
}