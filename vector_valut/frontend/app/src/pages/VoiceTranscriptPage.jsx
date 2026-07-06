import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShaderBackground from "../components/Conversation/voice-assiant/ShaderBackground";
import VoiceAssistTranscriptNav from "../components/Conversation/voice-assiant/VoiceAssistTranscriptNav";
import VoiceAssistTranscriptInterface from "../components/Conversation/voice-assiant/VoiceAssistTranscriptInterface";
import VoiceAssitTranscriptController from "../components/Conversation/voice-assiant/VoiceAssistTranscriptcontroller";
import { toast } from "sonner";

export default function VoiceTranscriptPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [sessionTime, setSessionTime] = useState("00:00");

  // Load transcript messages on component mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("voice_assistant_transcript");
      if (stored) {
        setMessages(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load transcripts from localStorage:", e);
    }

    // Set a mock session duration for context visual styling
    const start = Date.now() - 3 * 60 * 1000 - 45 * 1000; // 3m 45s ago
    const interval = setInterval(() => {
      const diff = Date.now() - start;
      const mins = Math.floor(diff / 60000).toString().padStart(2, "0");
      const secs = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0");
      setSessionTime(`${mins}:${secs}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Clear session logs
  const handleClearHistory = () => {
    localStorage.removeItem("voice_assistant_transcript");
    setMessages([]);
    toast.success("Transcript history cleared.");
  };

  // Export transcript logs as txt
  const handleExportText = () => {
    if (messages.length === 0) {
      toast.warning("No conversation transcript to export.");
      return;
    }

    try {
      const fileContent = messages
        .map((msg) => `[${msg.time}] ${msg.role.toUpperCase()}: ${msg.text}`)
        .join("\n\n");

      const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
      const element = document.createElement("a");
      element.href = URL.createObjectURL(blob);
      element.download = `voice_transcript_${Date.now()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("Transcript exported successfully.");
    } catch (err) {
      console.error("Failed to export txt file:", err);
      toast.error("Export failed. Please check permissions.");
    }
  };

  // Share conversation handler (mock dialog indicator)
  const handleShareSession = () => {
    if (messages.length === 0) {
      toast.warning("No conversation history to share.");
      return;
    }
    navigator.clipboard.writeText(JSON.stringify(messages, null, 2));
    toast.success("Transcript copied to clipboard. Ready to share!");
  };

  return (
    <div className="bg-[#051424] text-[#d5e4fa] min-h-screen flex flex-col justify-between overflow-hidden relative selection:bg-primary/30 font-sans">
      
      {/* 1. Full-screen WebGL Shader Background */}
      <ShaderBackground opacity={0.35} />

      {/* 2. Grid overlay texture */}
      <div className="fixed inset-0 grid-overlay pointer-events-none z-0"></div>

      {/* Navigation Header */}
      <VoiceAssistTranscriptNav 
        sessionTime={sessionTime} 
        onClose={() => navigate("/conversations")} 
      />

      {/* Scrollable Conversation Interface */}
      <VoiceAssistTranscriptInterface 
        messages={messages} 
        navigate={navigate} 
      />

      {/* Actions footer controller panel */}
      <VoiceAssitTranscriptController
        onClear={handleClearHistory}
        onMicClick={() => navigate("/voice-assistant")}
        onExit={() => navigate("/conversations")}
        onExport={handleExportText}
        onShare={handleShareSession}
      />

    </div>
  );
}
