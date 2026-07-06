import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuthHook";
import voiceAssistService from "../apis/voiceAssist";
import { getTenantApps } from "../apis/app.api";
import { getAllRag } from "../apis/rag.api";
import ShaderBackground from "../components/Conversation/voice-assiant/ShaderBackground";
import VoiceListenNav from "../components/Conversation/voice-assiant/VoiceListenNav";
import VoiceSpeakNav from "../components/Conversation/voice-assiant/VoiceSpeakNav";
import VoiceListenController from "../components/Conversation/voice-assiant/VoiceListenController";
import VoiceAssistSpeakController from "../components/Conversation/voice-assiant/VoiceAssistSpeakController";
import VoiceAssistTranscriptNav from "../components/Conversation/voice-assiant/VoiceAssistTranscriptNav";
import VoiceAssistTranscriptInterface from "../components/Conversation/voice-assiant/VoiceAssistTranscriptInterface";
import VoiceAssitTranscriptController from "../components/Conversation/voice-assiant/VoiceAssistTranscriptcontroller";
import { toast } from "sonner";

export default function VoiceAssisantPage() {
  const navigate = useNavigate();
  const { tenant } = useAuth();
  const tenantId = tenant?.tenantId || localStorage.getItem("tenantId");

  // Panel modes:
  // 'voice-active' (mic orb), 'live-transcript' (minimized tray), 'ended-transcript' (session finished)
  const [panelMode, setPanelMode] = useState("voice-active");

  // Voice Session State
  // 'idle' | 'listening' | 'recording' | 'processing' | 'speaking'
  const [status, setStatus] = useState("listening");
  const [mode, setMode] = useState("transcribe"); // 'transcribe' | 'translate'
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);

  // App & Document context selection
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showAppDropdown, setShowAppDropdown] = useState(false);
  const [showDocDropdown, setShowDocDropdown] = useState(false);

  // Transcription & AI generated response text
  const [transcriptionText, setTranscriptionText] = useState("");
  const [aiResponseText, setAiResponseText] = useState("");

  // Conversation history states
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem("voice_assistant_transcript");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // MediaRecorder & Playback References
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlaybackRef = useRef(null);
  const recordingTimeoutRef = useRef(null);

  // Session duration timer states
  const [sessionTime, setSessionTime] = useState("00:00");
  const sessionStartRef = useRef(Date.now());

  // Waveform heights state (32 bars)
  const [waveformHeights, setWaveformHeights] = useState(new Array(32).fill(8));

  // Initialize: Load app & doc contexts
  useEffect(() => {
    async function loadContexts() {
      try {
        const appsRes = await getTenantApps();
        if (appsRes?.success && appsRes?.data?.length > 0) {
          setApps(appsRes.data);
          setSelectedApp(appsRes.data[0]);
        }

        const docsRes = await getAllRag();
        if (docsRes?.success && docsRes?.data?.length > 0) {
          setDocuments(docsRes.data);
          setSelectedDoc(docsRes.data[0]);
        }
      } catch (err) {
        console.error("Failed to load conversation contexts:", err);
      }
    }
    loadContexts();
  }, []);

  // Sync session timer
  useEffect(() => {
    let timer;
    if (panelMode !== "ended-transcript") {
      timer = setInterval(() => {
        const diff = Date.now() - sessionStartRef.current;
        const mins = Math.floor(diff / 60000).toString().padStart(2, "0");
        const secs = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0");
        setSessionTime(`${mins}:${secs}`);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [panelMode]);

  // Waveform bouncing micro-animations
  useEffect(() => {
    let interval;
    if (status === "listening" || status === "recording" || status === "speaking") {
      interval = setInterval(() => {
        setWaveformHeights((prev) =>
          prev.map(() => {
            const minHeight = status === "speaking" ? 14 : status === "recording" ? 20 : 8;
            const maxHeight = status === "speaking" ? 48 : status === "recording" ? 64 : 16;
            return Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
          })
        );
      }, 100);
    } else {
      setWaveformHeights(new Array(32).fill(8));
    }
    return () => clearInterval(interval);
  }, [status]);

  // Audio Playback Handler
  const playAudioResponse = (base64Audio) => {
    if (!isSpeakerEnabled) {
      setStatus("listening");
      return;
    }

    try {
      if (audioPlaybackRef.current) {
        audioPlaybackRef.current.pause();
      }

      const audioUrl = `data:audio/wav;base64,${base64Audio}`;
      const audio = new Audio(audioUrl);
      audioPlaybackRef.current = audio;
      setStatus("speaking");

      audio.onended = () => {
        setStatus("listening");
      };

      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setStatus("listening");
        toast.error("Audio playback encountered an error.");
      };

      audio.play().catch((err) => {
        console.error("Autoplay failed:", err);
        setStatus("listening");
      });
    } catch (err) {
      console.error("Error setting up audio:", err);
      setStatus("listening");
    }
  };

  // Start Voice Recording
  const startRecording = async () => {
    if (isMuted) {
      toast.warning("Microphone is currently muted.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        if (audioBlob.size < 2000) {
          setStatus("listening");
          return;
        }

        processAudioInput(audioBlob);
      };

      mediaRecorder.start(250);
      setStatus("recording");

      recordingTimeoutRef.current = setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      }, 12000);
    } catch (err) {
      console.error("Mic access denied:", err);
      toast.error("Could not access microphone. Please check permissions.");
      setStatus("listening");
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  // Process voice audio through backend API
  const processAudioInput = async (audioBlob) => {
    setStatus("processing");
    try {
      const audioFile = new File([audioBlob], "speech.webm", { type: "audio/webm" });
      
      const payloadOptions = {
        appId: selectedApp?.appId,
        docId: selectedDoc?.docId,
        topK: 5,
        conversationId: activeConversationId || undefined
      };

      let res;
      if (mode === "transcribe") {
        res = await voiceAssistService.transcribeAudio(audioFile, tenantId, payloadOptions);
      } else {
        res = await voiceAssistService.translateAudio(audioFile, tenantId, payloadOptions);
      }

      if (res?.success && res?.data) {
        const { answer, audio, userPrompt, conversationId } = res.data;
        
        if (conversationId) {
          setActiveConversationId(conversationId);
        }

        setTranscriptionText("Voice prompt processed successfully.");
        setAiResponseText(answer || "I've processed your request.");

        // Append turns to messages state
        const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const userMsg = {
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
          role: "user",
          text: userPrompt || "Spoken audio request",
          time: timeStr
        };
        const assistantMsg = {
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
          role: "assistant",
          text: answer,
          time: timeStr,
          citations: selectedDoc ? [{ docName: selectedDoc.docName }] : []
        };

        setMessages((prev) => {
          const updated = [...prev, userMsg, assistantMsg];
          localStorage.setItem("voice_assistant_transcript", JSON.stringify(updated));
          return updated;
        });

        if (audio) {
          playAudioResponse(audio);
        } else {
          setStatus("listening");
        }
      } else {
        throw new Error(res?.error?.message || "Service call failed");
      }
    } catch (err) {
      console.error("Failed to process voice command:", err);
      toast.error(err.message || "Voice processing failed. Please try again.");
      setStatus("listening");
    }
  };

  // Toggle Recording manually by clicking the orb
  const handleOrbClick = () => {
    if (status === "listening") {
      startRecording();
    } else if (status === "recording") {
      stopRecording();
    } else if (status === "speaking") {
      if (audioPlaybackRef.current) {
        audioPlaybackRef.current.pause();
      }
      setStatus("listening");
    }
  };

  // End voice call session - transitions to ended-transcript mode
  const handleEndCall = () => {
    if (audioPlaybackRef.current) {
      audioPlaybackRef.current.pause();
    }
    stopRecording();
    setStatus("idle");
    setPanelMode("ended-transcript");
    toast.success("Voice session ended.");
  };

  // Clear session logs
  const handleClearHistory = () => {
    localStorage.removeItem("voice_assistant_transcript");
    setMessages([]);
    toast.success("Transcript history cleared.");
  };

  // Export logs to txt file
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

  // Share conversation logs
  const handleShareSession = () => {
    if (messages.length === 0) {
      toast.warning("No conversation history to share.");
      return;
    }
    navigator.clipboard.writeText(JSON.stringify(messages, null, 2));
    toast.success("Transcript copied to clipboard. Ready to share!");
  };

  // Handle final exit, clears temp logs and goes back to panel 3
  const handleBackToChat = () => {
    localStorage.removeItem("voice_assistant_transcript");
    navigate("/conversations");
  };

  // Keyboard shortcut listener for CMD/CTRL + K to type instead
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        navigate("/conversations");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <div className="bg-[#051424] text-[#d5e4fa] min-h-screen overflow-hidden relative selection:bg-primary/30 font-sans">
      {/* 1. Full-screen WebGL Shader Background */}
      <ShaderBackground opacity={panelMode === "ended-transcript" ? 0.35 : 0.55} />

      {/* 2. Subtle Grid overlay texture */}
      <div className="fixed inset-0 grid-overlay pointer-events-none z-0"></div>

      {/* Main Interactive UI Container */}
      <div className="fixed inset-0 z-10 flex flex-col justify-between items-center py-6 px-4 md:py-8 md:px-10 bg-gradient-to-b from-[#051424]/40 via-transparent to-[#051424]/80">
        
        {/* Render Listening/Speaking Nav Headers when active */}
        {panelMode !== "ended-transcript" && (
          status !== "speaking" ? (
            <VoiceListenNav
              selectedApp={selectedApp}
              apps={apps}
              setSelectedApp={setSelectedApp}
              showAppDropdown={showAppDropdown}
              setShowAppDropdown={setShowAppDropdown}
              selectedDoc={selectedDoc}
              documents={documents}
              setSelectedDoc={setSelectedDoc}
              showDocDropdown={showDocDropdown}
              setShowDocDropdown={setShowDocDropdown}
              mode={mode}
              setMode={setMode}
              onClose={handleEndCall}
              panelMode={panelMode}
              onToggleExpand={() => setPanelMode("voice-active")}
            />
          ) : (
            <VoiceSpeakNav
              selectedApp={selectedApp}
              apps={apps}
              setSelectedApp={setSelectedApp}
              showAppDropdown={showAppDropdown}
              setShowAppDropdown={setShowAppDropdown}
              selectedDoc={selectedDoc}
              documents={documents}
              setSelectedDoc={setSelectedDoc}
              showDocDropdown={showDocDropdown}
              setShowDocDropdown={setShowDocDropdown}
              mode={mode}
              setMode={setMode}
              onClose={handleEndCall}
              panelMode={panelMode}
              onToggleExpand={() => setPanelMode("voice-active")}
            />
          )
        )}

        {/* Render Active Voice Controls when active */}
        {panelMode === "voice-active" && (
          status !== "speaking" ? (
            <VoiceListenController
              status={status}
              waveformHeights={waveformHeights}
              onOrbClick={handleOrbClick}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
              isSpeakerEnabled={isSpeakerEnabled}
              setIsSpeakerEnabled={setIsSpeakerEnabled}
              onEndCall={handleEndCall}
              onTypeInstead={() => navigate("/conversations")}
            />
          ) : (
            <VoiceAssistSpeakController
              status={status}
              aiResponseText={aiResponseText}
              selectedDoc={selectedDoc}
              onOrbClick={handleOrbClick}
              onEndCall={handleEndCall}
              onTabChange={(tab) => {
                if (tab === "conversations") navigate("/conversations");
                else if (tab === "corpora") navigate("/corpora");
                else if (tab === "documents") navigate("/documents");
              }}
              onSeeTranscript={() => setPanelMode("live-transcript")}
            />
          )
        )}

        {/* Render ended-transcript full viewport logs */}
        {panelMode === "ended-transcript" && (
          <div className="w-full flex-grow flex flex-col justify-between items-center z-20 h-full relative">
            <VoiceAssistTranscriptNav 
              sessionTime={sessionTime} 
              onClose={handleBackToChat} 
            />
            <VoiceAssistTranscriptInterface 
              messages={messages} 
              navigate={navigate} 
            />
            <VoiceAssitTranscriptController
              onClear={handleClearHistory}
              onMicClick={() => {
                setMessages([]);
                localStorage.removeItem("voice_assistant_transcript");
                sessionStartRef.current = Date.now();
                setPanelMode("voice-active");
                setStatus("listening");
              }}
              onExit={handleBackToChat}
              onExport={handleExportText}
              onShare={handleShareSession}
            />
          </div>
        )}

      </div>

      {/* 4. Slide-up live-transcript Sheet Tray */}
      <div 
        className={`fixed inset-x-0 bottom-0 bg-[#051424]/95 backdrop-blur-xl border-t border-white/10 z-40 transition-all duration-500 ease-out flex flex-col ${
          panelMode === "live-transcript" ? "h-[72vh] opacity-100 translate-y-0" : "h-0 opacity-0 translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex-grow flex flex-col h-full overflow-hidden relative">
          <VoiceAssistTranscriptInterface 
            messages={messages} 
            navigate={navigate} 
          />
          <div className="p-4 bg-[#010f1f]/95 border-t border-white/5 flex items-center justify-between z-50">
            <button 
              onClick={handleClearHistory}
              className="px-4 py-2 rounded-full border border-white/10 text-white/60 hover:text-white transition-colors text-xs font-semibold uppercase cursor-pointer"
            >
              Clear Logs
            </button>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setPanelMode("voice-active")}
                className="px-5 py-2 rounded-full bg-[#6dfad2]/20 border border-[#6dfad2]/30 hover:bg-[#6dfad2]/30 text-[#6dfad2] transition-all text-xs font-bold uppercase tracking-wider cursor-pointer font-sans"
              >
                Resume Voice
              </button>
              <button 
                onClick={handleEndCall}
                className="px-5 py-2 rounded-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 transition-colors text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
