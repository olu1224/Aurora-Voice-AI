
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
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export type AmbientType = 'None' | 'Rainy Day' | 'Coffee Shop' | 'Office Buzz' | 'Quiet Garden';

export interface AgentConfig {
  voiceName: 'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Aoede' | 'Hesperus' | 'Eos' | 'Astra' | 'Boreas' | 'Iris' | 'Nyx' | 'Helios' | 'Selene';
  tone: string;
  speakingRate: number;
  ambientEffect: AmbientType;
  ambientVolume: number;
}

const bookMeetingDeclaration: FunctionDeclaration = {
  name: 'bookMeeting',
  parameters: {
    type: Type.OBJECT,
    description: 'Schedules a meeting or call with the prospect.',
    properties: {
      date: { type: Type.STRING, description: 'The date of the meeting (e.g. 2024-05-20)' },
      time: { type: Type.STRING, description: 'The time of the meeting (e.g. 14:30)' },
      purpose: { type: Type.STRING, description: 'The primary goal of the meeting.' }
    },
    required: ['date', 'time', 'purpose']
  }
};

export class AuroraVoiceService {
  private ai: any;
  private session: any;
  private audioContext: AudioContext | null = null;
  private outputContext: AudioContext | null = null;
  private nextStartTime = 0;
  private sources = new Set<AudioBufferSourceNode>();
  private stream: MediaStream | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;

  private activeConfig: AgentConfig;
  private ambientSource: AudioBufferSourceNode | null = null;
  private ambientGain: GainNode | null = null;

  constructor(apiKey: string, initialConfig: AgentConfig) {
    this.ai = new GoogleGenAI({ apiKey });
    this.activeConfig = initialConfig;
  }

  private createAmbientBuffer(type: AmbientType): AudioBuffer | null {
    if (!this.outputContext || type === 'None') return null;
    const sampleRate = this.outputContext.sampleRate;
    const duration = 10; 
    const buffer = this.outputContext.createBuffer(2, sampleRate * duration, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < data.length; i++) {
        let noise = Math.random() * 2 - 1;
        
        if (type === 'Rainy Day') {
          noise = (noise * 0.4) + (Math.random() > 0.9995 ? Math.random() : 0);
        } else if (type === 'Coffee Shop') {
          noise = noise * (Math.sin(i * 0.0005) * 0.1 + 0.9) * 0.3;
        } else if (type === 'Office Buzz') {
          noise = (Math.sin(i * 0.002) * 0.05) + (noise * 0.15);
        } else if (type === 'Quiet Garden') {
          noise = noise * 0.1;
        }
        data[i] = noise;
      }
    }
    return buffer;
  }

  private updateAmbient(type: AmbientType, volume: number) {
    if (!this.outputContext) return;
    if (this.ambientSource) {
      try { this.ambientSource.stop(); } catch(e) {}
      this.ambientSource = null;
    }
    if (!this.ambientGain) {
      this.ambientGain = this.outputContext.createGain();
      this.ambientGain.connect(this.outputContext.destination);
    }
    
    this.ambientGain.gain.setTargetAtTime(volume, this.outputContext.currentTime, 0.2);

    const buffer = this.createAmbientBuffer(type);
    if (buffer) {
      this.ambientSource = this.outputContext.createBufferSource();
      this.ambientSource.buffer = buffer;
      this.ambientSource.loop = true;
      this.ambientSource.connect(this.ambientGain);
      this.ambientSource.start();
    }
  }

  async connect(
    systemInstruction: string, 
    onTranscription?: (text: string, isUser: boolean, isFinal: boolean) => void,
    onMeetingBooked?: (details: any) => void
  ) {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    this.outputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    this.updateAmbient(this.activeConfig.ambientEffect, this.activeConfig.ambientVolume);

    const enhancedInstruction = `${systemInstruction}
      YOUR ROLE: You are the 24/7 AI Voice Receptionist for the business. 
      PRIMARY OBJECTIVE: Ensure every call is captured, qualify the prospect, answer questions using the provided business intelligence, and book appointments. 
      YOUR VOICE PERSONA: ${this.activeConfig.voiceName}
      TONE: ${this.activeConfig.tone}
      AMBIENT CONTEXT: You are calling from a ${this.activeConfig.ambientEffect} office environment.
      Current Date: ${new Date().toLocaleDateString()}
    `;

    const sessionPromise = this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          const source = this.audioContext!.createMediaStreamSource(this.stream!);
          this.scriptProcessor = this.audioContext!.createScriptProcessor(4096, 1, 1);
          
          this.scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = createBlob(inputData);
            sessionPromise.then((session: any) => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };

          source.connect(this.scriptProcessor);
          this.scriptProcessor.connect(this.audioContext!.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          if (message.toolCall) {
            for (const fc of message.toolCall.functionCalls) {
              if (fc.name === 'bookMeeting') {
                onMeetingBooked?.(fc.args);
                sessionPromise.then((session: any) => {
                  session.sendToolResponse({
                    functionResponses: { id: fc.id, name: fc.name, response: { status: 'Appointment confirmed and added to calendar.' } }
                  });
                });
              }
            }
          }

          if (message.serverContent?.outputTranscription) {
            onTranscription?.(message.serverContent.outputTranscription.text, false, false);
          } else if (message.serverContent?.inputTranscription) {
            onTranscription?.(message.serverContent.inputTranscription.text, true, false);
          }

          if (message.serverContent?.turnComplete) {
            onTranscription?.('', false, true);
          }

          const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio && this.outputContext) {
            this.nextStartTime = Math.max(this.nextStartTime, this.outputContext.currentTime);
            const audioBuffer = await decodeAudioData(decode(base64Audio), this.outputContext, 24000, 1);
            const source = this.outputContext.createBufferSource();
            
            source.buffer = audioBuffer;
            source.playbackRate.value = this.activeConfig.speakingRate; 
            
            source.connect(this.outputContext.destination);
            source.addEventListener('ended', () => this.sources.delete(source));
            source.start(this.nextStartTime);
            
            this.nextStartTime += (audioBuffer.duration / this.activeConfig.speakingRate);
            this.sources.add(source);
          }

          if (message.serverContent?.interrupted) {
            this.sources.forEach(s => { try { s.stop(); } catch(e) {} });
            this.sources.clear();
            this.nextStartTime = 0;
          }
        },
        onerror: (e: any) => console.error('Aurora Session Error:', e),
        onclose: () => console.log('Aurora Session Closed'),
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { 
            prebuiltVoiceConfig: { 
              voiceName: this.activeConfig.voiceName 
            } 
          },
        },
        tools: [{ functionDeclarations: [bookMeetingDeclaration] }],
        systemInstruction: enhancedInstruction,
        outputAudioTranscription: {},
        inputAudioTranscription: {},
      },
    });

    this.session = await sessionPromise;
    return this.session;
  }

  updateConfig(config: Partial<AgentConfig>) {
    this.activeConfig = { ...this.activeConfig, ...config };
    if (config.ambientEffect !== undefined || config.ambientVolume !== undefined) {
      this.updateAmbient(this.activeConfig.ambientEffect, this.activeConfig.ambientVolume);
    }
  }

  disconnect() {
    this.session?.close();
    this.stream?.getTracks().forEach(t => t.stop());
    this.audioContext?.close();
    this.outputContext?.close();
    this.scriptProcessor?.disconnect();
    if (this.ambientSource) {
      try { this.ambientSource.stop(); } catch(e) {}
    }
  }
}
