
import React, { useCallback, useRef } from 'react';
import { UploadedFile } from '../types';
import { UploadCloudIcon, TrashIcon } from './Icons';

interface UploadStepProps {
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  onGenerate: () => void;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const PRESET_STYLES = [
    { name: 'Corporate', prompt: 'A professional corporate headshot, studio lighting, blurred office background.' },
    { name: 'Creative', prompt: 'A creative headshot for an artist, warm natural lighting, minimalist background.' },
    { name: 'Tech', prompt: 'A modern headshot for a tech professional, clean look, neutral background, approachable expression.' },
    { name: 'Outdoor', prompt: 'An outdoor headshot, natural light, blurred green background, looking confident.' },
];

const UploadStep: React.FC<UploadStepProps> = ({
  uploadedFiles,
  setUploadedFiles,
  prompt,
  setPrompt,
  onGenerate,
  error,
  setError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (uploadedFiles.length + files.length > 5) {
        setError("You can upload a maximum of 5 images.");
        return;
    }

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = (e.target?.result as string).split(',')[1];
        if (base64) {
          setUploadedFiles(prev => [...prev, {
            base64,
            mimeType: file.type,
            name: file.name
          }]);
        }
      };
      reader.readAsDataURL(file);
    });
    setError(null);
  }, [uploadedFiles, setUploadedFiles, setError]);
  
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    if (uploadedFiles.length - 1 < 3) {
        setError("Please upload at least 3 images.");
    } else {
        setError(null);
    }
  };

  const isGenerateDisabled = uploadedFiles.length < 3 || uploadedFiles.length > 5 || !prompt;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-100 mb-2">Step 1: Upload 3 to 5 Photos</h2>
        <p className="text-slate-400">Upload clear, well-lit photos of yourself. Different angles and expressions work best.</p>
      </div>

      <div 
        className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloudIcon className="mx-auto h-12 w-12 text-slate-500" />
        <p className="mt-2 text-slate-400">Click to upload or drag and drop</p>
        <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          accept="image/png, image/jpeg" 
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {uploadedFiles.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-300 mb-2">Uploaded Files: {uploadedFiles.length}/5</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <img 
                  src={`data:${file.mimeType};base64,${file.base64}`} 
                  alt={file.name} 
                  className="w-full h-32 object-cover rounded-md"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => removeFile(index)} className="text-white p-2 rounded-full hover:bg-red-500/80">
                     <TrashIcon className="w-6 h-6" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-slate-100 mb-2">Step 2: Choose Your Style</h2>
        <p className="text-slate-400 mb-4">Describe your desired headshot or select one of our popular presets.</p>
        <div className="flex flex-wrap gap-2 mb-4">
            {PRESET_STYLES.map(style => (
                <button
                    key={style.name}
                    onClick={() => setPrompt(style.prompt)}
                    className={`px-4 py-2 text-sm rounded-full transition-colors ${prompt === style.prompt ? 'bg-indigo-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                >
                    {style.name}
                </button>
            ))}
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A professional corporate headshot..."
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
          rows={3}
        ></textarea>
      </div>
      
      {error && <p className="text-red-400 text-center">{error}</p>}
      
      <div className="text-center">
        <button
          onClick={onGenerate}
          disabled={isGenerateDisabled}
          className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-all transform hover:scale-105"
        >
          Generate My Headshot
        </button>
      </div>
    </div>
  );
};

export default UploadStep;
