import { useEffect, useState } from "react";

export default function PipelineAnimation({ isUploading, activeFile }) {
  const [step, setStep] = useState(0); // 0: Idle, 1: Extracting, 2: Chunking, 3: Embedding, 4: Indexed
  const [progress, setProgress] = useState(0);
  const [estimatedChunks, setEstimatedChunks] = useState(0);

  useEffect(() => {
    if (isUploading && activeFile) {
      setStep(1);
      setProgress(0);
      
      // Calculate mock estimate details based on size
      const sizeMB = activeFile.size ? activeFile.size / (1024 * 1024) : 0.5;
      const chunks = Math.max(12, Math.round(sizeMB * 150));
      setEstimatedChunks(chunks);

      // Transition simulations
      const t1 = setTimeout(() => {
        setStep(2);
      }, 2000);

      const t2 = setTimeout(() => {
        setStep(3);
        // Start progress bar animation
        let currentP = 0;
        const interval = setInterval(() => {
          currentP += Math.round(Math.random() * 8) + 4;
          if (currentP >= 100) {
            currentP = 100;
            clearInterval(interval);
            setStep(4);
          }
          setProgress(currentP);
        }, 300);
      }, 4000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      // Idle state defaults
      setStep(0);
      setProgress(0);
    }
  }, [isUploading, activeFile]);

  // CSS class helper for state dots
  const getDotStyle = (currentStep) => {
    if (step === 0) {
      return "bg-[#1c2b3c] text-[#c8c4d7]/40 border border-white/5";
    }
    if (step > currentStep) {
      // Completed step
      return "bg-[#4bddb7] text-[#002018] shadow-[0_0_8px_rgba(75,221,183,0.4)]";
    }
    if (step === currentStep) {
      // Active step
      return "bg-[#6c5ce7] text-white shadow-[0_0_12px_rgba(108,92,231,0.5)] animate-pulse";
    }
    // Pending step
    return "bg-[#1c2b3c] text-[#c8c4d7]/40 border border-white/5";
  };

  const getTextStyle = (currentStep) => {
    if (step === currentStep) return "text-white font-bold";
    if (step > currentStep) return "text-[#c8c4d7]/70";
    return "text-[#c8c4d7]/40";
  };

  return (
    <div className="bg-[#11141c]/70 backdrop-blur-xl border border-white/5 rounded-xl p-6 flex flex-col h-full text-left">
      
      {/* Title Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-['JetBrains_Mono'] text-[10px] text-[#c8c4d7]/50 uppercase tracking-widest font-semibold">
          Live Pipeline
        </h3>
        <span className={`px-2 py-0.5 font-['JetBrains_Mono'] text-[9px] rounded border font-semibold ${step > 0 && step < 4 ? 'bg-[#4bddb7]/10 text-[#4bddb7] border-[#4bddb7]/20 animate-pulse' : step === 4 ? 'bg-[#c6bfff]/10 text-[#c6bfff] border-[#c6bfff]/20' : 'bg-white/5 text-[#c8c4d7]/40 border-white/5'}`}>
          {step > 0 && step < 4 ? 'PROCESSING' : step === 4 ? 'INGESTED' : 'STANDBY'}
        </span>
      </div>

      {/* Progress Track */}
      <div className="space-y-6 relative flex-grow flex flex-col justify-between py-1">
        
        {/* Glowing track line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-white/5 z-0"></div>
        {step > 1 && (
          <div 
            className="absolute left-[15px] top-4 w-0.5 bg-gradient-to-b from-[#4bddb7] via-[#6c5ce7] to-[#c6bfff] transition-all duration-1000 z-0"
            style={{ 
              height: step === 2 ? '30%' : step === 3 ? '65%' : '90%',
              boxShadow: '0 0 8px rgba(108,92,231,0.4)'
            }}
          ></div>
        )}

        {/* Step 1: Text Extraction */}
        <div className="relative flex items-start gap-4 z-10">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 text-xs font-semibold ${getDotStyle(1)}`}>
            {step > 1 ? (
              <span className="material-symbols-outlined text-sm font-bold">check</span>
            ) : step === 1 ? (
              <span className="material-symbols-outlined text-sm animate-spin">sync</span>
            ) : (
              <span>1</span>
            )}
          </div>
          <div className="flex-grow pt-0.5">
            <p className={`font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider ${getTextStyle(1)}`}>
              Extracting Text
            </p>
            <p className="text-[10px] text-[#c8c4d7]/40 mt-0.5">
              {step > 1 ? "Completed • Raw content retrieved" : step === 1 ? "Reading source bytes..." : "Waiting for upload..."}
            </p>
          </div>
        </div>

        {/* Step 2: Semantic Chunking */}
        <div className="relative flex items-start gap-4 z-10">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 text-xs font-semibold ${getDotStyle(2)}`}>
            {step > 2 ? (
              <span className="material-symbols-outlined text-sm font-bold">check</span>
            ) : step === 2 ? (
              <span className="material-symbols-outlined text-sm animate-spin">sync</span>
            ) : (
              <span>2</span>
            )}
          </div>
          <div className="flex-grow pt-0.5">
            <p className={`font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider ${getTextStyle(2)}`}>
              Semantic Chunking
            </p>
            <p className="text-[10px] text-[#c8c4d7]/40 mt-0.5">
              {step > 2 ? `Completed • Created ${estimatedChunks} chunks` : step === 2 ? "Partitioning text nodes..." : "Pending..."}
            </p>
          </div>
        </div>

        {/* Step 3: Embeddings Vector Generation */}
        <div className="relative flex items-start gap-4 z-10">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 text-xs font-semibold ${getDotStyle(3)}`}>
            {step > 3 ? (
              <span className="material-symbols-outlined text-sm font-bold">check</span>
            ) : step === 3 ? (
              <span className="material-symbols-outlined text-sm animate-spin">sync</span>
            ) : (
              <span>3</span>
            )}
          </div>
          <div className="flex-grow pt-0.5">
            <p className={`font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider ${getTextStyle(3)}`}>
              Vector Embedding
            </p>
            {step === 3 && (
              <div className="w-full mt-2">
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#6c5ce7] to-[#4bddb7] rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-[9px] text-[#c8c4d7]/60 mt-1 font-mono">
                  <span>Calculating multidimensional tokens</span>
                  <span>{progress}%</span>
                </div>
              </div>
            )}
            {step > 3 && (
              <p className="text-[10px] text-[#c8c4d7]/40 mt-0.5">Completed • text-embedding-3-large</p>
            )}
            {step < 3 && (
              <p className="text-[10px] text-[#c8c4d7]/40 mt-0.5">Pending...</p>
            )}
          </div>
        </div>

        {/* Step 4: Database Indexing */}
        <div className="relative flex items-start gap-4 z-10">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 text-xs font-semibold ${getDotStyle(4)}`}>
            {step === 4 ? (
              <span className="material-symbols-outlined text-sm text-[#002018] font-bold">done_all</span>
            ) : (
              <span className="material-symbols-outlined text-sm">inventory_2</span>
            )}
          </div>
          <div className="flex-grow pt-0.5">
            <p className={`font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider ${getTextStyle(4)}`}>
              Vector Indexed
            </p>
            <p className="text-[10px] text-[#c8c4d7]/40 mt-0.5">
              {step === 4 ? "Live • Available for query models" : "Pending..."}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}