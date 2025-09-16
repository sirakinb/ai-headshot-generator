
import React, { useCallback, useRef } from 'react';
import { UploadedFile } from '../types';
import { UploadCloudIcon, TrashIcon } from './Icons';
import { useUser, SignUpButton } from '@clerk/clerk-react';
import { useUsage } from '../contexts/UsageContext';

interface UploadStepProps {
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  onGenerate: () => void;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  onShowPricing?: () => void;
}

const PRESET_STYLES = [
    { name: 'Corporate', prompt: 'Generate a high-quality professional corporate headshot. Studio lighting, sharp focus on face, blurred office background, confident expression, business attire, professional makeup and grooming, shot from chest up, centered composition, high resolution.' },
    { name: 'Creative', prompt: 'Generate a high-quality creative professional headshot. Warm natural lighting, artistic composition, minimalist clean background, approachable expression, creative styling, shot from chest up, sharp focus on face, high resolution.' },
    { name: 'Tech', prompt: 'Generate a high-quality modern tech professional headshot. Clean contemporary lighting, neutral background, confident and approachable expression, modern casual-professional attire, sharp focus on face, shot from chest up, high resolution.' },
    { name: 'Outdoor', prompt: 'Generate a high-quality outdoor professional headshot. Natural daylight, beautifully blurred green background, confident and warm expression, professional attire, sharp focus on face, shot from chest up, high resolution photography.' },
];

const UploadStep: React.FC<UploadStepProps> = ({
  uploadedFiles,
  setUploadedFiles,
  prompt,
  setPrompt,
  onGenerate,
  error,
  setError,
  onShowPricing,
}) => {
  const { isSignedIn, user } = useUser();
  const { canGenerate, generationsUsed, subscriptionType } = useUsage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    if (uploadedFiles.length + fileArray.length > 5) {
        setError("You can upload a maximum of 5 images.");
        return;
    }

    // Check all files first
    const invalidFiles = fileArray.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError("Please upload only image files (PNG, JPG).");
      return;
    }

    // Process valid files
    fileArray.forEach(file => {
      console.log('Processing file:', file.name, 'type:', file.type);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log('File read complete:', file.name, 'result length:', result?.length);
        if (result) {
          const base64 = result.split(',')[1];
          if (base64) {
            console.log('Adding file to state:', file.name);
            setUploadedFiles(prev => {
              console.log('Previous files:', prev.length);
              return [...prev, {
                base64,
                mimeType: file.type,
                name: file.name
              }];
            });
          }
        }
      };
      reader.onerror = () => {
        setError(`Failed to read file: ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
    setError(null);
  }, [uploadedFiles, setUploadedFiles, setError]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log('File input changed, files:', files);
    if (!files) return;
    
    // Clear the input so the same file can be selected again
    event.target.value = '';
    
    if (!isSignedIn) {
      setError("Please sign up to upload photos and create your headshot.");
      return;
    }
    
    console.log('Processing files:', Array.from(files).map(f => f.name));
    processFiles(files);
  }, [processFiles, isSignedIn, setError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (!isSignedIn) {
      setError("Please sign up to upload photos and create your headshot.");
      return;
    }

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles, isSignedIn, setError]);
  
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    if (uploadedFiles.length - 1 < 3) {
        setError("Please upload at least 3 images.");
    } else {
        setError(null);
    }
  };

  const isGenerateDisabled = uploadedFiles.length < 3 || uploadedFiles.length > 5 || !prompt || !isSignedIn || !canGenerate;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-100 mb-2">Step 1: Upload 3 to 5 Photos</h2>
        <p className="text-slate-400">Upload clear, well-lit photos of yourself. Different angles and expressions work best.</p>
      </div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragOver
                    ? 'border-indigo-400 bg-indigo-500/10'
                    : 'border-slate-600 hover:border-indigo-500'
                }`}
                onClick={() => {
                  if (!isSignedIn) {
                    setError("Please sign up to upload photos and create your headshot.");
                    return;
                  }
                  fileInputRef.current?.click();
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
        <UploadCloudIcon className="mx-auto h-12 w-12 text-slate-500" />
        {isSignedIn ? (
          <>
            <p className="mt-2 text-slate-400">Click to upload or drag and drop</p>
            <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
          </>
        ) : (
          <>
            <p className="mt-2 text-slate-400">Sign up to upload your photos</p>
            <p className="text-xs text-slate-500">Create your professional headshot in seconds</p>
          </>
        )}
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
      
      {error && (
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          {!isSignedIn && error.includes("sign up") && (
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Ready to create your professional headshot?</h3>
              <p className="text-slate-300 mb-4">Sign up now to upload your photos and generate stunning AI headshots in seconds.</p>
              <div className="flex items-center justify-center gap-4">
                <SignUpButton>
                  <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-500 transition-colors font-semibold">
                    Sign Up - It's Free!
                  </button>
                </SignUpButton>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Usage indicator */}
      {isSignedIn && (
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
            <span className="text-slate-300 text-sm">
              {subscriptionType === 'unlimited' 
                ? '✨ Unlimited generations' 
                : subscriptionType === 'standard'
                ? `${5 - generationsUsed} generations remaining this month`
                : generationsUsed === 0 
                ? '1 free generation available' 
                : 'Free generation used'}
            </span>
            {subscriptionType === 'free' && generationsUsed > 0 && onShowPricing && (
              <button
                onClick={onShowPricing}
                className="text-indigo-400 text-xs hover:text-indigo-300 hover:underline transition-all cursor-pointer font-medium"
              >
                • Upgrade for more
              </button>
            )}
            {subscriptionType === 'standard' && generationsUsed >= 5 && onShowPricing && (
              <button
                onClick={onShowPricing}
                className="text-indigo-400 text-xs hover:text-indigo-300 hover:underline transition-all cursor-pointer font-medium"
              >
                • Upgrade to unlimited
              </button>
            )}
          </div>
        </div>
      )}

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
