import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuthHook";
import voiceAssistService from "../apis/voiceAssist";
import { getTenantApps } from "../apis/app.api";
import { getAllRag } from "../apis/rag.api";
import ShaderBackground from "../components/Conversation/voice-assiant/ShaderBackground";
import { toast } from "sonner";

export default function VoiceAssisantPage() {
  const navigate = useNavigate();
  const { tenant } = useAuth();
  const tenantId = tenant?.tenantId || localStorage.getItem("tenantId");

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

  // MediaRecorder & Playback References
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlaybackRef = useRef(null);
  const recordingTimeoutRef = useRef(null);

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
        // Stop all track streams to release hardware
        stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        if (audioBlob.size < 2000) {
          // Audio too short / silent
          setStatus("listening");
          return;
        }

        // Trigger processing pipeline
        processAudioInput(audioBlob);
      };

      mediaRecorder.start(250);
      setStatus("recording");

      // Auto-stop recording after 12 seconds to prevent excessive payloads
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

  // Send Recorded Audio to express/python backend
  const processAudioInput = async (audioBlob) => {
    setStatus("processing");
    try {
      // Reformat blob name for server multer compatibility
      const audioFile = new File([audioBlob], "speech.webm", { type: "audio/webm" });
      
      let res;
      if (mode === "transcribe") {
        res = await voiceAssistService.transcribeAudio(audioFile, tenantId);
      } else {
        res = await voiceAssistService.translateAudio(audioFile, tenantId);
      }

      if (res?.success && res?.data) {
        const { answer, audio } = res.data;
        setTranscriptionText("Voice prompt processed successfully.");
        setAiResponseText(answer || "I've processed your translation request.");

        // Save exchange to local storage transcripts history
        saveToTranscriptHistory(answer);

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

  // Append exchange to localStorage history
  const saveToTranscriptHistory = (answer) => {
    try {
      const stored = localStorage.getItem("voice_assistant_transcript");
      const messagesList = stored ? JSON.parse(stored) : [];

      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      
      const newPrompt = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
        role: "user",
        text: "Spoken audio request",
        time: timeStr
      };

      const newAnswer = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
        role: "assistant",
        text: answer,
        time: timeStr,
        citations: selectedDoc ? [{ docName: selectedDoc.docName }] : []
      };

      const updated = [...messagesList, newPrompt, newAnswer];
      localStorage.setItem("voice_assistant_transcript", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save transcript:", e);
    }
  };

  // Toggle Recording manually by clicking the orb
  const handleOrbClick = () => {
    if (status === "listening") {
      startRecording();
    } else if (status === "recording") {
      stopRecording();
    } else if (status === "speaking") {
      // Interrupt playback
      if (audioPlaybackRef.current) {
        audioPlaybackRef.current.pause();
      }
      setStatus("listening");
    }
  };

  // End voice call session
  const handleEndCall = () => {
    if (audioPlaybackRef.current) {
      audioPlaybackRef.current.pause();
    }
    stopRecording();
    setStatus("idle");
    toast.success("Voice session ended.");
    navigate("/voice-transcript");
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
      <ShaderBackground opacity={0.55} />

      {/* 2. Subtle Grid overlay texture */}
      <div className="fixed inset-0 grid-overlay pointer-events-none z-0"></div>

      {/* Main Interactive UI Container */}
      <div className="fixed inset-0 z-10 flex flex-col justify-between items-center py-10 px-6 md:px-10 bg-gradient-to-b from-[#051424]/40 via-transparent to-[#051424]/80">
        
        {/* Top Header Navigation */}
        <header className="w-full flex justify-between items-start z-30">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#e4deff] text-3xl font-fill" style={{ fontVariationSettings: "'FILL' 1" }}>
                psychology
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-[#e4deff]">Vector Vault Voice</h1>
            </div>

            {/* Interactive Scope Pills / Context Dropdowns */}
            <div className="flex items-center gap-2 relative">
              
              {/* App Selector Pill */}
              <div className="relative">
                <button 
                  onClick={() => { setShowAppDropdown(!showAppDropdown); setShowDocDropdown(false); }}
                  className="bg-[#1d2b3c]/85 hover:bg-[#283647] px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#6dfad2]">hub</span>
                  <span className="text-sm font-medium text-[#d5e4fa]">
                    {selectedApp ? selectedApp.name : "Select App"}
                  </span>
                  <span className="material-symbols-outlined text-xs">arrow_drop_down</span>
                </button>
                {showAppDropdown && (
                  <div className="absolute top-10 left-0 w-52 glass-panel rounded-xl shadow-2xl p-2 flex flex-col gap-1 z-50">
                    {apps.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => { setSelectedApp(app); setShowAppDropdown(false); }}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors"
                      >
                        {app.name}
                      </button>
                    ))}
                    {apps.length === 0 && <span className="text-xs text-white/40 p-2 block">No apps created</span>}
                  </div>
                )}
              </div>

              {/* Doc Selector Pill */}
              <div className="relative">
                <button 
                  onClick={() => { setShowDocDropdown(!showDocDropdown); setShowAppDropdown(false); }}
                  className="bg-[#e4deff]/10 hover:bg-[#e4deff]/20 px-4 py-1.5 rounded-full border border-[#e4deff]/20 flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#e4deff]">description</span>
                  <span className="text-sm font-medium text-[#e4deff]">
                    {selectedDoc ? selectedDoc.docName : "All Documents"}
                  </span>
                  <span className="material-symbols-outlined text-xs">arrow_drop_down</span>
                </button>
                {showDocDropdown && (
                  <div className="absolute top-10 left-0 w-64 glass-panel rounded-xl shadow-2xl p-2 flex flex-col gap-1 z-50 max-h-60 overflow-y-auto">
                    <button
                      onClick={() => { setSelectedDoc(null); setShowDocDropdown(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors text-white/60"
                    >
                      All Documents
                    </button>
                    {documents.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => { setSelectedDoc(doc); setShowDocDropdown(false); }}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors"
                      >
                        {doc.docName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Action Settings Cluster */}
          <div className="flex items-center gap-3">
            {/* Mode switch */}
            <div className="bg-[#122031]/80 px-2 py-1 rounded-full border border-white/5 flex items-center gap-1">
              <button 
                onClick={() => setMode("transcribe")}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  mode === "transcribe" ? "bg-[#c6bfff] text-[#160066]" : "text-white/60 hover:text-white"
                }`}
              >
                Transcribe
              </button>
              <button 
                onClick={() => setMode("translate")}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  mode === "translate" ? "bg-[#6dfad2] text-[#002018]" : "text-white/60 hover:text-white"
                }`}
              >
                Translate
              </button>
            </div>
            <button className="w-12 h-12 flex items-center justify-center rounded-full glass-panel text-[#c9c5d0] hover:text-white transition-all active:scale-95">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <button 
              onClick={() => navigate("/conversations")}
              className="w-12 h-12 flex items-center justify-center rounded-full glass-panel text-[#c9c5d0] hover:text-white transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </header>

        {/* Central Visualization Area */}
        <main className="flex-1 w-full flex flex-col items-center justify-center relative z-20">
          
          {/* Animated Central Orb Trigger */}
          <div 
            onClick={handleOrbClick}
            className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center cursor-pointer transition-all hover:scale-105"
          >
            {/* Atmospheric Glow Aura */}
            <div className={`absolute inset-0 rounded-full blur-[80px] transition-all duration-700 ${
              status === "recording" ? "bg-red-500/25 animate-pulse" :
              status === "speaking" ? "bg-[#4BDDB7]/25 animate-pulse" : "bg-[#6C5CE7]/20"
            }`}></div>

            {/* Listening State SVGs */}
            {status !== "speaking" && (
              <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                {/* Outer Rotating Ring */}
                <circle cx="100" cy="100" fill="none" r="95" stroke={status === "recording" ? "rgba(239, 68, 68, 0.15)" : "rgba(198,191,255,0.08)"} strokeDasharray="10 20" strokeWidth="2">
                  <animateTransform attributeName="transform" dur="20s" from="0 100 100" repeatCount="infinite" to="360 100 100" type="rotate" />
                </circle>
                
                {/* Middle Rotating Ring */}
                <circle cx="100" cy="100" fill="none" r="78" stroke={status === "recording" ? "rgba(239, 68, 68, 0.25)" : "rgba(108,92,231,0.15)"} strokeDasharray="5 15" strokeWidth="2">
                  <animateTransform attributeName="transform" dur="12s" from="360 100 100" repeatCount="infinite" to="0 100 100" type="rotate" />
                </circle>

                {/* Breathing Sphere */}
                <defs>
                  <radialGradient id="listeningGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={status === "recording" ? "#EF4444" : "#6C5CE7"} stopOpacity="0.65" />
                    <stop offset="70%" stopColor={status === "recording" ? "#EF4444" : "#6C5CE7"} stopOpacity="0.15" />
                    <stop offset="100%" stopColor={status === "recording" ? "#EF4444" : "#6C5CE7"} stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="100" cy="100" fill="url(#listeningGlow)" r="60">
                  <animate attributeName="r" calcMode="spline" dur="2.5s" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" repeatCount="infinite" values="55;64;55" />
                  <animate attributeName="opacity" dur="2.5s" repeatCount="infinite" values="0.65;0.95;0.65" />
                </circle>

                {/* Inner Core Dot */}
                <circle cx="100" cy="100" fill={status === "recording" ? "#EF4444" : "#C6BFFF"} r="12">
                  <animate attributeName="opacity" dur="1.5s" repeatCount="infinite" values="0.8;1;0.8" />
                  <circle cx="100" cy="100" fill={status === "recording" ? "#EF4444" : "#C6BFFF"} opacity="0.4" r="12">
                    <animate attributeName="r" dur="1.5s" repeatCount="infinite" values="12;24" />
                    <animate attributeName="opacity" dur="1.5s" repeatCount="infinite" values="0.4;0" />
                  </circle>
                </circle>
              </svg>
            )}

            {/* Speaking State SVGs */}
            {status === "speaking" && (
              <svg className="w-full h-full scale-110" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                {/* Outer Rotating Ring */}
                <circle cx="100" cy="100" fill="none" r="95" stroke="rgba(75,221,183,0.15)" strokeDasharray="10 20" strokeWidth="2">
                  <animateTransform attributeName="transform" dur="15s" from="0 100 100" repeatCount="infinite" to="360 100 100" type="rotate" />
                </circle>
                
                {/* Middle Rotating Ring */}
                <circle cx="100" cy="100" fill="none" r="78" stroke="rgba(75,221,183,0.25)" strokeDasharray="5 15" strokeWidth="2">
                  <animateTransform attributeName="transform" dur="10s" from="360 100 100" repeatCount="infinite" to="0 100 100" type="rotate" />
                </circle>

                {/* Breathing Sphere (Teal) */}
                <defs>
                  <radialGradient id="speakingGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#4BDDB7" stopOpacity="0.75" />
                    <stop offset="70%" stopColor="#4BDDB7" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#4BDDB7" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="100" cy="100" fill="url(#speakingGlow)" r="60">
                  <animate attributeName="r" calcMode="spline" dur="1.8s" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" repeatCount="infinite" values="55;68;55" />
                  <animate attributeName="opacity" dur="1.8s" repeatCount="infinite" values="0.7;1;0.7" />
                </circle>

                {/* Core Dot (Teal) */}
                <circle cx="100" cy="100" fill="#4BDDB7" r="12">
                  <animate attributeName="opacity" dur="1s" repeatCount="infinite" values="0.8;1;0.8" />
                  <circle cx="100" cy="100" fill="#4BDDB7" opacity="0.4" r="12">
                    <animate attributeName="r" dur="1s" repeatCount="infinite" values="12;28" />
                    <animate attributeName="opacity" dur="1s" repeatCount="infinite" values="0.5;0" />
                  </circle>
                </circle>
              </svg>
            )}

            {/* Symmetrical Waveform Overlay inside orb */}
            {status === "speaking" && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1.5 h-12 z-30">
                <div className="waveform-bar w-1 rounded-full bg-[#4BDDB7]" style={{ animationDelay: "0.1s", height: "12px" }}></div>
                <div className="waveform-bar w-1 rounded-full bg-[#4BDDB7]" style={{ animationDelay: "0.3s", height: "24px" }}></div>
                <div className="waveform-bar w-1 rounded-full bg-[#4BDDB7]" style={{ animationDelay: "0.5s", height: "32px" }}></div>
                <div className="waveform-bar w-1 rounded-full bg-[#4BDDB7]" style={{ animationDelay: "0.2s", height: "20px" }}></div>
                <div className="waveform-bar w-1 rounded-full bg-[#4BDDB7]" style={{ animationDelay: "0.4s", height: "28px" }}></div>
                <div className="waveform-bar w-1 rounded-full bg-[#4BDDB7]" style={{ animationDelay: "0.6s", height: "16px" }}></div>
              </div>
            )}
          </div>

          {/* Status Label Stack */}
          <div className="text-center mt-12 space-y-3 max-w-xl px-6">
            <h2 className="text-2xl font-bold text-white tracking-wide uppercase">
              {status === "listening" && "Mic is Ready"}
              {status === "recording" && "Listening..."}
              {status === "processing" && "Thinking..."}
              {status === "speaking" && "Speaking..."}
            </h2>
            <p className="text-sm text-[#c9c5d0]/80">
              {status === "listening" && "Click the orb or tap here to start speaking"}
              {status === "recording" && "Click again when you finish speaking"}
              {status === "processing" && "Analyzing voice patterns and retrieving context"}
              {status === "speaking" && "Playing back voice assistant answer"}
            </p>

            {/* Live Text Transcript Output card */}
            {status === "speaking" && aiResponseText && (
              <div className="mt-8 p-6 glass-panel rounded-2xl border border-white/10 text-left max-w-lg shadow-2xl relative">
                <p className="text-base text-white font-medium leading-relaxed">
                  {aiResponseText}
                </p>
                {selectedDoc && (
                  <div className="flex gap-2 mt-4 pt-3 border-t border-white/5">
                    <div className="bg-[#4BDDB7]/10 px-3 py-1 rounded-full border border-[#4BDDB7]/20 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-[#4BDDB7]">description</span>
                      <span className="text-[11px] font-semibold text-[#4BDDB7]">{selectedDoc.docName}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Audio Waveform visualization bar panel */}
          {status !== "speaking" && (
            <div className="mt-16 h-20 flex items-center justify-center gap-1.5 w-full max-w-lg px-8">
              {waveformHeights.map((height, i) => (
                <div 
                  key={i}
                  className={`w-1 rounded-full transition-all duration-100 ${
                    status === "recording" 
                      ? "bg-gradient-to-t from-red-500 to-[#c6bfff]" 
                      : "bg-gradient-to-t from-[#c6bfff] to-[#6dfad2]"
                  }`}
                  style={{ height: `${height}px` }}
                ></div>
              ))}
            </div>
          )}
        </main>

        {/* Footer controls container */}
        <footer className="w-full grid grid-cols-3 items-center z-30">
          
          {/* Left: Mic / Speaker Status Indicators */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="group flex flex-col items-center gap-2"
            >
              <div className={`w-14 h-14 rounded-full glass-panel flex items-center justify-center transition-all ${
                isMuted ? "border-red-500 text-red-500 bg-red-500/10" : "text-white/70 hover:text-white"
              }`}>
                <span className="material-symbols-outlined text-[24px]">
                  {isMuted ? "mic_off" : "mic"}
                </span>
              </div>
              <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors">
                {isMuted ? "Muted" : "Mute"}
              </span>
            </button>

            <button 
              onClick={() => setIsSpeakerEnabled(!isSpeakerEnabled)}
              className="group flex flex-col items-center gap-2"
            >
              <div className={`w-14 h-14 rounded-full glass-panel flex items-center justify-center transition-all ${
                !isSpeakerEnabled ? "border-red-500 text-red-500 bg-red-500/10" : "text-white/70 hover:text-white"
              }`}>
                <span className="material-symbols-outlined text-[24px]">
                  {isSpeakerEnabled ? "volume_up" : "volume_off"}
                </span>
              </div>
              <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors">
                Speaker
              </span>
            </button>
          </div>

          {/* Center Action: End Session Call */}
          <div className="flex justify-center">
            <button 
              onClick={handleEndCall}
              className="btn-glow-error flex items-center gap-3 px-8 h-16 rounded-full bg-gradient-to-r from-red-500 to-red-800 text-white font-bold text-base transition-transform active:scale-95 shadow-xl"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                call_end
              </span>
              <span>End Call</span>
            </button>
          </div>

          {/* Right Controls: Keyboard Text Chat Toggle */}
          <div className="flex justify-end">
            <button 
              onClick={() => navigate("/conversations")}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
            >
              <span className="text-sm font-semibold">Type instead</span>
              <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
              <div className="ml-2 px-2.5 py-1 rounded bg-[#283647] border border-white/10 text-[11px] font-mono text-[#c9c5d0]">
                ⌘ K
              </div>
            </button>
          </div>

        </footer>

      </div>
    </div>
  );
}
