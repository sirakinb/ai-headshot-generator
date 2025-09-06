
import React, { useState, useCallback } from 'react';
import { AppState, UploadedFile } from './types';
import { generateHeadshot } from './services/geminiService';
import UploadStep from './components/UploadStep';
import GeneratingStep from './components/GeneratingStep';
import ResultStep from './components/ResultStep';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [prompt, setPrompt] = useState<string>('A professional corporate headshot, studio lighting, blurred office background.');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = useCallback(() => {
    setAppState(AppState.UPLOAD);
    setUploadedFiles([]);
    setPrompt('A professional corporate headshot, studio lighting, blurred office background.');
    setGeneratedImage(null);
    setError(null);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (uploadedFiles.length < 3 || uploadedFiles.length > 5 || !prompt) {
      setError("Please upload 3 to 5 images and provide a style prompt.");
      return;
    }
    setError(null);
    setAppState(AppState.GENERATING);
    try {
      const result = await generateHeadshot(uploadedFiles, prompt);
      if (result && result.image) {
        setGeneratedImage(result.image);
        setAppState(AppState.RESULT);
      } else {
        throw new Error(result?.text || "The AI did not return an image. Please try a different prompt or different images.");
      }
    } catch (e: any) {
      setError(e.message || "An unknown error occurred during image generation.");
      setAppState(AppState.UPLOAD);
    }
  }, [uploadedFiles, prompt]);

  const renderContent = () => {
    switch (appState) {
      case AppState.UPLOAD:
        return (
          <UploadStep
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleGenerate}
            error={error}
            setError={setError}
          />
        );
      case AppState.GENERATING:
        return <GeneratingStep />;
      case AppState.RESULT:
        return <ResultStep generatedImage={generatedImage} onReset={handleReset} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col font-sans">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
