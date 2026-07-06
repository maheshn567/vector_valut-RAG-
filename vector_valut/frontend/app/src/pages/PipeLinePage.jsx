import { useState } from "react";
import PipelineAnimation from "../components/documents/PiplineAnimation";

export default function PipeLinePage() {
  const demoFiles = [
    { name: "annual_report_2026.pdf", size: 2450000, type: "pdf", icon: "picture_as_pdf" },
    { name: "api_v2_specifications.md", size: 850000, type: "md", icon: "description" },
    { name: "company_handbook.txt", size: 1150000, type: "txt", icon: "article" }
  ];

  const [selectedFile, setSelectedFile] = useState(demoFiles[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [runKey, setRunKey] = useState(0); // Used to reset/restart animation

  const handleStartProcess = () => {
    setIsProcessing(true);
    setRunKey(prev => prev + 1);
  };

  const handleStopProcess = () => {
    setIsProcessing(false);
  };

  return (
    <div className="relative min-h-screen text-[#d5e4fa] font-sans selection:bg-primary/30 pb-24">
      {/* Background grid texture */}
      <div className="absolute inset-0 grid-texture pointer-events-none opacity-20 z-0"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#6c5ce7] opacity-[0.04] blur-[120px] rounded-full pointer-events-none z-0 animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#4bddb7] opacity-[0.03] blur-[120px] rounded-full pointer-events-none z-0 animate-pulse" style={{ animationDelay: "-3s" }}></div>

      <div className="max-w-[1100px] mx-auto pt-16 px-6 relative z-10 text-left">
        
        {/* Header Hero */}
        <header className="mb-16 border-b border-white/5 pb-10">
          <span className="font-mono text-xs text-primary font-bold uppercase tracking-widest block mb-2">VECTOR ENGINEERING</span>
          <h1 className="font-display-lg text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Ingestion Pipeline</h1>
          <p className="text-base text-[#c9c5d0] leading-relaxed max-w-2xl">
            Witness our high-performance document chunking and vector mapping operations in real-time. Pick a sample file below to simulate semantic partitioning, embeddings calculation, and database indexing.
          </p>
        </header>

        {/* Sandbox Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* File Picker Controller */}
          <div className="col-span-12 md:col-span-5 glass-card bg-[#11141c]/50 border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">1. Select Sample Document</h3>
                <p className="text-xs text-[#c9c5d0]/65 leading-relaxed">Choose a structured or unstructured data file to feed into the vectorization pipeline.</p>
              </div>

              <div className="space-y-3">
                {demoFiles.map(file => {
                  const isChosen = selectedFile.name === file.name;
                  return (
                    <button
                      key={file.name}
                      onClick={() => {
                        if (!isProcessing) {
                          setSelectedFile(file);
                        }
                      }}
                      disabled={isProcessing}
                      className={`w-full text-left flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                        isChosen 
                          ? "bg-[#6c5ce7]/10 border-[#6c5ce7] text-white" 
                          : "bg-[#0d1c2d]/20 border-white/5 text-[#c9c5d0] hover:bg-white/5 hover:text-white"
                      } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined text-lg ${isChosen ? "text-[#c6bfff]" : "text-[#c9c5d0]/50"}`}>
                          {file.icon}
                        </span>
                        <div className="space-y-0.5 max-w-[180px] sm:max-w-xs">
                          <p className="text-xs font-bold truncate">{file.name}</p>
                          <p className="text-[10px] font-mono text-[#c9c5d0]/40">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isChosen ? "border-[#6c5ce7] bg-[#6c5ce7]" : "border-white/20"
                      }`}>
                        {isChosen && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-8">
              {!isProcessing ? (
                <button
                  onClick={handleStartProcess}
                  className="w-full py-3 bg-[#6c5ce7] hover:bg-[#5b4cc4] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#6c5ce7]/20 hover:scale-95 active:scale-90 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">play_arrow</span>
                  Process Ingestion
                </button>
              ) : (
                <button
                  onClick={handleStopProcess}
                  className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs uppercase tracking-wider rounded-xl hover:scale-95 active:scale-90 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">stop</span>
                  Stop Simulation
                </button>
              )}
            </div>
          </div>

          {/* Live Animation Render */}
          <div className="col-span-12 md:col-span-7">
            <PipelineAnimation 
              key={runKey}
              isUploading={isProcessing} 
              activeFile={selectedFile} 
            />
          </div>

        </div>

      </div>
    </div>
  );
}
