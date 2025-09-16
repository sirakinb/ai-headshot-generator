
import React, { useState, useCallback } from 'react';
import { AppState, UploadedFile } from './types';
import { generateHeadshot } from './services/geminiService';
import UploadStep from './components/UploadStep';
import GeneratingStep from './components/GeneratingStep';
import ResultStep from './components/ResultStep';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { UsageProvider, useUsage } from './contexts/UsageContext';
import { UpsellModal } from './components/UpsellModal';
import { PricingPage } from './components/PricingPage';

function AppContent() {
  const { canGenerate, incrementUsage, generationsUsed, subscriptionType } = useUsage();
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [prompt, setPrompt] = useState<string>('Generate a high-quality professional corporate headshot. Studio lighting, sharp focus on face, blurred office background, confident expression, business attire, professional makeup and grooming, shot from chest up, centered composition, high resolution.');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUpsell, setShowUpsell] = useState<boolean>(false);
  const [showPricing, setShowPricing] = useState<boolean>(false);

  const addWatermark = useCallback(async (imageDataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        // Load and draw the watermark
        const watermark = new Image();
        watermark.onload = () => {
          const watermarkSize = Math.min(img.width, img.height) * 0.15; // 15% of the smaller dimension
          const x = img.width - watermarkSize - 20; // 20px from right edge
          const y = img.height - watermarkSize - 20; // 20px from bottom edge
          
          // Add semi-transparent background for watermark
          ctx.globalAlpha = 0.8;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fillRect(x - 10, y - 10, watermarkSize + 20, watermarkSize + 20);
          
          // Draw watermark
          ctx.globalAlpha = 0.7;
          ctx.drawImage(watermark, x, y, watermarkSize, watermarkSize);
          
          resolve(canvas.toDataURL('image/png'));
        };
        watermark.src = '/PENTRIDGE_logo.png';
      };
      
      img.src = imageDataUrl;
    });
  }, []);

  const handleReset = useCallback(() => {
    setAppState(AppState.UPLOAD);
    setUploadedFiles([]);
    setPrompt('Generate a high-quality professional corporate headshot. Studio lighting, sharp focus on face, blurred office background, confident expression, business attire, professional makeup and grooming, shot from chest up, centered composition, high resolution.');
    setGeneratedImage(null);
    setError(null);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (uploadedFiles.length < 3 || uploadedFiles.length > 5 || !prompt) {
      setError("Please upload 3 to 5 images and provide a style prompt.");
      return;
    }

    // Check usage limits
    if (!canGenerate) {
      setShowUpsell(true);
      return;
    }

    setError(null);
    setAppState(AppState.GENERATING);
    try {
      const result = await generateHeadshot(uploadedFiles, prompt);
      if (result && result.image) {
        // Add watermark only for free users
        let finalImage = result.image;
        if (subscriptionType === 'free') {
          finalImage = await addWatermark(result.image);
        }
        
        setGeneratedImage(finalImage);
        await incrementUsage(); // Track the usage
        setAppState(AppState.RESULT);
      } else {
        throw new Error(result?.text || "The AI did not return an image. Please try a different prompt or different images.");
      }
    } catch (e: any) {
      setError(e.message || "An unknown error occurred during image generation.");
      setAppState(AppState.UPLOAD);
    }
  }, [uploadedFiles, prompt, canGenerate, subscriptionType, incrementUsage]);

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
            onShowPricing={() => setShowPricing(true)}
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

  // Show pricing page if requested
  if (showPricing) {
    return <PricingPage onBack={() => setShowPricing(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col font-sans">
      <Header onShowPricing={() => setShowPricing(true)} />
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </main>
      <Footer />
      <UpsellModal 
        isOpen={showUpsell} 
        onClose={() => setShowUpsell(false)}
        onGoToPricing={() => {
          setShowUpsell(false);
          setShowPricing(true);
        }}
      />
    </div>
  );
}

function App() {
  return (
    <UsageProvider>
      <AppContent />
    </UsageProvider>
  );
}

export default App;
