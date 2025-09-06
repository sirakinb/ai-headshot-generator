
import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './Icons';

const loadingMessages = [
    "Analyzing facial features...",
    "Selecting the best angles from your photos...",
    "Applying professional studio lighting...",
    "Enhancing details and textures...",
    "Compositing the final headshot...",
    "Perfecting the finishing touches...",
];

const GeneratingStep: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-800/50 rounded-lg shadow-xl">
            <SparklesIcon className="w-16 h-16 text-indigo-400 animate-pulse-slow" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-text">
                Creating your masterpiece...
            </h2>
            <p className="mt-4 text-slate-300">
                Our AI is hard at work. This may take a moment.
            </p>
            <div className="mt-8 w-full max-w-md h-4 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 animate-pulse" style={{ width: '100%' }}></div>
            </div>
            <p className="mt-4 text-slate-400 min-h-[2em]">
                {loadingMessages[messageIndex]}
            </p>
        </div>
    );
};

export default GeneratingStep;
