import React, { useRef, useEffect } from "react";
import LLM_response_fromater from "../../../utility/LLM_response_fromater.jsx";

export default function VoiceAssistTranscriptInterface({ messages, navigate, isTray = false }) {
  const transcriptEndRef = useRef(null);

  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <main className="flex-1 w-full overflow-y-auto px-4 md:px-10 py-6 space-y-6 scroll-smooth select-text z-20 relative">
      {messages.map((msg) => (
        <div 
          key={msg.id}
          className={`flex flex-col gap-2 max-w-3xl ${
            msg.role === "user" ? "items-end ml-auto max-w-xl" : "items-start"
          }`}
        >
          {/* Message Bubble wrapper */}
          <div className={`p-5 rounded-2xl ${
            msg.role === "user" 
              ? "bg-[#e4deff]/10 border border-[#e4deff]/20 rounded-tr-none text-[#d5e4fa]" 
              : "glass-panel border-l-4 border-l-[#6dfad2] border-y-white/5 border-r-white/5 rounded-tl-none text-[#d5e4fa] shadow-lg w-full"
          }`}>
            {/* Assistant Label */}
            {msg.role === "assistant" && (
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[#6dfad2] text-[18px] font-fill" style={{ fontVariationSettings: "'FILL' 1" }}>
                  psychology
                </span>
                <span className="text-xs font-bold text-[#6dfad2] uppercase tracking-wider font-sans">Vector Vault AI</span>
              </div>
            )}
            
            {msg.role === "user" ? (
              <p className="text-[15px] leading-relaxed font-normal">
                {msg.text}
              </p>
            ) : (
              <LLM_response_fromater response={msg.text} />
            )}

            {/* Inline Citations */}
            {msg.citations && msg.citations.length > 0 && (
              <div className="mt-4 pt-3 border-t border-white/5 flex gap-2">
                {msg.citations.map((cit, idx) => (
                  <div key={idx} className="bg-[#1d2b3c] px-3 py-1 rounded border border-white/10 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-[#c9c5d0]">description</span>
                    <span className="text-[11px] font-mono text-[#c9c5d0]">{cit.docName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Timestamp label */}
          <span className="text-[10px] text-white/40 uppercase font-mono px-2">
            {msg.time}
          </span>
        </div>
      ))}

      {/* Empty log handler */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto z-20 relative">
          <div className="w-20 h-20 rounded-full bg-[#c6bfff]/10 flex items-center justify-center mb-6 border border-[#c6bfff]/20 animate-pulse">
            <span className="material-symbols-outlined text-[#c6bfff] text-4xl font-fill" style={{ fontVariationSettings: "'FILL' 1" }}>
              graphic_eq
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Voice Transcript Available</h3>
          <p className="text-sm text-[#c9c5d0]/80 mb-8 leading-relaxed font-sans">
            Connect and start speaking to the Voice Assistant to ask questions or translate documents. The transcript log will update automatically in real-time.
          </p>
          <button 
            onClick={() => navigate("/voice-assistant")}
            className="px-6 py-3 rounded-full bg-gradient-to-tr from-[#e4dfff] to-[#6dfad2] text-[#160066] font-bold text-sm tracking-wide uppercase shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Launch Voice Assistant
          </button>
        </div>
      )}

      {/* Invisible anchor element to snap scrolling */}
      <div ref={transcriptEndRef} />
    </main>
  );
}