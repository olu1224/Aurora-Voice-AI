
import React, { useState, useRef } from 'react';
import { 
  ImageIcon, 
  Upload, 
  Sparkles, 
  RefreshCcw, 
  Download, 
  Loader2, 
  X,
  Plus,
  ArrowRight,
  Filter
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const VisualAI: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage || !prompt.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      // Always initialize GoogleGenAI with a named parameter apiKey.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = selectedImage.split(',')[1];
      
      // Use gemini-2.5-flash-image for standard image editing tasks.
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
            { text: prompt }
          ]
        }
      });

      let foundImage = false;
      // Iterate through all parts to find the image part in the response.
      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setResultImage(`data:image/png;base64,${part.inlineData.data}`);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        console.error("No image returned in model response parts.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-outfit text-white flex items-center gap-3">
            <ImageIcon className="text-emerald-400" /> Visual Content AI
          </h2>
          <p className="text-slate-400">Edit business photos, remove backgrounds, or add brand filters with text.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
        <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] p-8 flex flex-col items-center justify-center relative overflow-hidden group">
          {selectedImage ? (
            <div className="w-full h-full relative animate-in zoom-in-95">
              <img src={selectedImage} alt="Source" className="w-full h-full object-contain rounded-2xl" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-full text-slate-400 hover:text-white transition-all shadow-xl"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full border-2 border-dashed border-slate-800 rounded-[32px] flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
            >
              <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 group-hover:scale-110 transition-transform shadow-xl">
                <Upload size={32} className="text-emerald-400" />
              </div>
              <p className="mt-6 text-sm font-bold text-slate-400 group-hover:text-white uppercase tracking-widest">Upload Marketing Image</p>
              <p className="mt-2 text-xs text-slate-600">JPG, PNG up to 10MB</p>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>
          )}
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] flex flex-col shadow-2xl relative overflow-hidden">
          <div className="p-6 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={16} className="text-cyan-400" /> AI Creative Result
            </h3>
            {resultImage && (
              <a 
                href={resultImage} 
                download="aurora-visual-ai.png"
                className="text-[10px] font-bold text-cyan-400 flex items-center gap-1.5 hover:underline"
              >
                <Download size={12} /> Download Final
              </a>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950/20">
            {resultImage ? (
              <img src={resultImage} alt="Result" className="max-w-full max-h-full object-contain rounded-2xl animate-in zoom-in duration-500 shadow-2xl shadow-cyan-500/10" />
            ) : isProcessing ? (
              <div className="flex flex-col items-center gap-6 animate-pulse">
                 <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center">
                   <Loader2 size={32} className="text-cyan-400 animate-spin" />
                 </div>
                 <div className="text-center">
                   <p className="text-sm font-bold text-white mb-2">Gemini is rendering content...</p>
                   <p className="text-xs text-slate-500 italic max-w-xs">Analyzing textures and applying your prompt parameters.</p>
                 </div>
              </div>
            ) : (
              <div className="text-center opacity-30 flex flex-col items-center">
                 <Filter size={48} className="text-slate-600 mb-4" />
                 <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">Ready for edit</p>
                 <p className="text-[10px] text-slate-700 mt-2 italic">Select an image and enter a command to start.</p>
              </div>
            )}
          </div>

          <div className="p-8 border-t border-slate-800 bg-slate-900/40 backdrop-blur-md">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Visual Command</label>
                <div className="flex gap-2">
                   {["Retro Filter", "Remove Background"].map(tag => (
                     <button 
                      key={tag} 
                      onClick={() => setPrompt(tag)}
                      className="text-[8px] font-bold px-2 py-1 rounded-full bg-slate-800 text-slate-400 hover:text-cyan-400 border border-slate-700 transition-all"
                     >
                       {tag}
                     </button>
                   ))}
                </div>
              </div>
              <div className="relative">
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Add a retro 80s neon filter to this photo..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none shadow-inner"
                  rows={2}
                />
              </div>
              <button 
                onClick={handleEdit}
                disabled={!selectedImage || !prompt.trim() || isProcessing}
                className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-95"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <MagicWand size={20} />}
                Generate Advanced Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple icon for Magic Wand since lucide might not have it or I want to be safe
const MagicWand: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m13 2 1.9 4.9L20 9l-5.1 2.1L13 16l-2.1-5.1L6 9l5.1-1.9L13 2Z"/>
    <path d="M7.1 12.1 3 13.9 7.1 16l2.1 4.1 1.8-4.1 4.1-2.1-4.1-1.8-2.1-4.1-1.8 4.1Z"/>
    <path d="M18.1 16.1l-2 3.9 2 2.1 1.9-2.1 4.1-1.9-4.1-2-1.9-4z"/>
  </svg>
);

export default VisualAI;
