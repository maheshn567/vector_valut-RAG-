import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuthHook";
import ShaderBackground from "../components/Conversation/voice-assiant/ShaderBackground";
import { toast } from "sonner";

export default function VoiceTranscriptPage() {
  const navigate = useNavigate();
  const { tenant } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [sessionTime, setSessionTime] = useState("04:32");
  const transcriptEndRef = useRef(null);

  // Pre-populated demo conversation history (as defined in design mockup) if history is empty
  const defaultMessages = [
    {
      id: "demo-1",
      role: "user",
      text: "Can you explain the general termination clauses for this SLA? I'm looking for notice periods specifically.",
      time: "01:14"
    },
    {
      id: "demo-2",
      role: "assistant",
      text: "Under Section 8.4 (Notice of Default), the agreement stipulates a 15-day grace period following a written notice of breach. If the breach is not cured within this window, the non-breaching party may terminate immediately.",
      time: "01:16",
      citations: [{ docName: "SLA_V4_FINAL.pdf (p. 22)" }]
    },
    {
      id: "demo-3",
      role: "user",
      text: "What happens if we choose to terminate early without a breach? Is there a financial penalty involved?",
      time: "03:45"
    },
    {
      id: "demo-4",
      role: "assistant",
      text: "Yes, Section 12.1 (Termination for Convenience) specifies that early termination by the client requires a 25% penalty fee of the remaining contract value. This is calculated based on the average monthly billing over the last quarter.",
      time: "03:47",
      citations: [{ docName: "Fee_Schedule_Exhibit_C.pdf" }]
    }
  ];

  // Load message logs from local storage or fallback to defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem("voice_assistant_transcript");
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        setMessages(defaultMessages);
        localStorage.setItem("voice_assistant_transcript", JSON.stringify(defaultMessages));
      }
    } catch (err) {
      setMessages(defaultMessages);
    }
  }, []);

  // Auto-scroll transcript logs to the bottom
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Export Transcript Log as a plain text file download
  const handleExport = () => {
    try {
      let fileContent = `=== VECTOR VAULT VOICE TRANSCRIPT ===\nExport Date: ${new Date().toLocaleString()}\n\n`;
      messages.forEach((msg) => {
        const roleLabel = msg.role === "user" ? "USER" : "VECTOR VAULT AI";
        fileContent += `[${msg.time}] ${roleLabel}:\n${msg.text}\n`;
        if (msg.citations && msg.citations.length > 0) {
          fileContent += `Sources: ${msg.citations.map((c) => c.docName).join(", ")}\n`;
        }
        fileContent += `\n------------------------------------\n\n`;
      });

      const element = document.createElement("a");
      const file = new Blob([fileContent], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `voice_transcript_${Date.now()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("Transcript successfully exported!");
    } catch (e) {
      toast.error("Failed to export transcript log.");
    }
  };

  // Clear Session Transcript
  const handleClearSession = () => {
    localStorage.removeItem("voice_assistant_transcript");
    setMessages([]);
    toast.success("Conversation history cleared.");
  };

  // Share session logic trigger placeholder
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Session URL copied to clipboard!");
    } else {
      toast.error("Share feature not supported on this browser.");
    }
  };

  return (
    <div className="bg-[#051424] text-[#d5e4fa] h-screen overflow-hidden relative font-sans">
      
      {/* 1. Full-screen WebGL Shader Background (Lower opacity for text contrast) */}
      <ShaderBackground opacity={0.35} />

      {/* 2. Grid overlay texture */}
      <div className="fixed inset-0 grid-overlay pointer-events-none z-0"></div>

      {/* Unified Content Shell wrapper */}
      <div className="relative z-10 flex flex-col h-full max-w-5xl mx-auto px-6 md:px-10 pb-20">
        
        {/* Header Console Navbar */}
        <header className="flex justify-between items-center py-6 h-16 w-full fixed top-0 left-0 px-6 md:px-16 z-30 bg-gradient-to-b from-[#051424]/80 to-transparent backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6dfad2] to-[#c6bfff] animate-pulse orb-glow"></div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-white leading-tight">Conversation Transcript</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6dfad2] animate-ping"></span>
                <span className="text-[10px] font-semibold text-[#c9c5d0] uppercase tracking-wider">Session Ended</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="bg-[#122031]/50 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <span className="text-xs font-mono font-bold text-[#6dfad2] tracking-widest">{sessionTime}</span>
            </div>
            <button className="material-symbols-outlined text-[#c9c5d0] hover:text-white transition-colors">
              settings
            </button>
            <button 
              onClick={() => navigate("/conversations")}
              className="material-symbols-outlined text-[#c9c5d0] hover:text-red-400 transition-colors"
            >
              close
            </button>
          </div>
        </header>

        {/* Scrollable Conversation Transcript Area */}
        <main className="flex-1 mt-24 mb-28 overflow-y-auto px-4 md:px-10 space-y-8 scroll-smooth pb-10 max-h-[calc(100vh-210px)] select-text">
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
                    <span className="text-xs font-bold text-[#6dfad2] uppercase tracking-wider">Vector Vault AI</span>
                  </div>
                )}
                
                <p className="text-[15px] leading-relaxed font-normal">
                  {msg.text}
                </p>

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
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <span className="material-symbols-outlined text-white/20 text-5xl mb-3">notes</span>
              <p className="text-white/40 text-sm">No audio transcript records available.</p>
            </div>
          )}

          {/* Invisible anchor element to snap scrolling */}
          <div ref={transcriptEndRef} />
        </main>

        {/* Floating Console controls footer */}
        <footer className="fixed bottom-0 left-0 w-full z-40 bg-gradient-to-t from-[#051424] via-[#051424]/90 to-transparent">
          <div className="bg-[#010f1f]/90 backdrop-blur-xl border-t border-white/5 px-6 md:px-16 py-5">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              
              {/* Left: Session active display */}
              <div className="hidden md:flex flex-col">
                <span className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Current Focus</span>
                <span className="text-xs text-[#6dfad2] font-semibold italic">"Analyzing downsizing clauses..."</span>
              </div>

              {/* Center Controls: Voice Restart Actions */}
              <div className="flex items-center gap-6 mx-auto md:mx-0">
                <button 
                  onClick={handleClearSession}
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all hover:scale-105 active:scale-95 text-white/60"
                  title="Clear history"
                >
                  <span className="material-symbols-outlined">delete_sweep</span>
                </button>
                
                {/* Central Microphone / Call trigger to return to assistant page */}
                <button 
                  onClick={() => navigate("/voice-assistant")}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#e4dfff] to-[#6dfad2] flex items-center justify-center orb-glow hover:scale-110 active:scale-90 transition-all duration-300 shadow-2xl"
                  title="Restart voice call"
                >
                  <span className="material-symbols-outlined text-[#2900a0] text-3xl font-fill" style={{ fontVariationSettings: "'FILL' 1" }}>
                    graphic_eq
                  </span>
                </button>

                <button 
                  onClick={() => navigate("/conversations")}
                  className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/20 flex items-center justify-center hover:bg-red-500/30 transition-all hover:scale-105 active:scale-95 text-red-400"
                  title="Exit chat"
                >
                  <span className="material-symbols-outlined">call_end</span>
                </button>
              </div>

              {/* Right: Export & share handlers */}
              <div className="hidden md:flex gap-3">
                <button 
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 hover:text-white text-white/80 transition-all text-xs font-semibold uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Export
                </button>
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#c6bfff] text-[#160066] font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">share</span>
                  Share
                </button>
              </div>

            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
