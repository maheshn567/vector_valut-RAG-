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
      <div className="fixed inset-0 z-10 flex flex-col justify-between items-center py-6 px-4 md:py-8 md:px-10 bg-gradient-to-b from-[#051424]/40 via-transparent to-[#051424]/80">
        
        {/* Render Listening/Speaking Nav Headers */}
        {status !== "speaking" ? (
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
            onClose={() => navigate("/conversations")}
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
            onClose={() => navigate("/conversations")}
          />
        )}

        {/* Render Listening/Speaking Controller Content */}
        {status !== "speaking" ? (
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
          />
        )}

      </div>
    </div>
  );
}
