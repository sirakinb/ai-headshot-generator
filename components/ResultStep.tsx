
import React from 'react';
import { DownloadIcon, RefreshIcon } from './Icons';

interface ResultStepProps {
  generatedImage: string | null;
  onReset: () => void;
}

const ResultStep: React.FC<ResultStepProps> = ({ generatedImage, onReset }) => {

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'ai-headshot.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-slate-100 mb-4">Your Headshot is Ready!</h2>
      <p className="text-slate-400 mb-8">Download your new professional headshot or start over to try a different style.</p>
      
      {generatedImage ? (
        <div className="mb-8 flex justify-center">
            <img 
                src={generatedImage} 
                alt="Generated AI headshot" 
                className="rounded-lg shadow-2xl max-w-full h-auto w-full max-w-md border-4 border-slate-700"
            />
        </div>
      ) : (
        <div className="mb-8 p-8 bg-slate-800 rounded-lg">
            <p className="text-red-400">Sorry, something went wrong and we couldn't generate your image.</p>
        </div>
      )}

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-slate-600 transition-colors"
        >
          <RefreshIcon className="w-5 h-5" />
          Start Over
        </button>
        <button
          onClick={handleDownload}
          disabled={!generatedImage}
          className="flex items-center gap-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          <DownloadIcon className="w-5 h-5" />
          Download
        </button>
      </div>
    </div>
  );
};

export default ResultStep;
