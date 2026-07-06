import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../Hooks/useAuthHook.jsx";
import { toast } from "sonner";
import SideBar from "../layout/SideBar.jsx";
import ChatHistoryComp from "../components/Conversation/ChatHistoryComp";
import ConversationNavComp from "../components/Conversation/ConversationNavComp";
import ChatInterFaceComp from "../components/Conversation/ChatInterFaceComp";
import UserPromptBoxComp from "../components/Conversation/UserPromptBoxComp";

import { getTenantApps } from "../apis/app.api";
import { getAllRag } from "../apis/rag.api";
import {
  listConversations,
  getConversation,
  deleteConversation,
} from "../apis/conversation.api";
import { askLlm } from "../apis/query.api";

export default function ConversationPage() {
  const { tenant } = useAuth();
  
  // RAG Workspace Layout/Config State
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState("all");
  
  // Conversations State
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  
  // RAG Model Hyperparameters
  const [rerankerOn, setRerankerOn] = useState(true);
  const [topK, setTopK] = useState(8);
  const [temp, setTemp] = useState(0.7);
  const [strategy, setStrategy] = useState("rag");
  const [isLoading, setIsLoading] = useState(false);

  // Load tenant apps and documents on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const appsRes = await getTenantApps();
        if (appsRes.success && appsRes.data) {
          setApps(appsRes.data);
          if (appsRes.data.length > 0) {
            setSelectedApp(appsRes.data[0]);
          }
        }

        const docsRes = await getAllRag();
        if (docsRes.success && docsRes.data) {
          setDocuments(docsRes.data);
        }
      } catch (err) {
        console.error("Failed to load apps or docs context:", err);
        toast.error("Failed to load workspace data.");
      }
    }
    loadInitialData();
  }, []);

  // Fetch list of conversations whenever tenant or selectedApp changes
  const loadConversations = useCallback(async () => {
    if (!tenant || !tenant.tenantId) return;
    const userId = tenant.tenantId;
    try {
      const res = await listConversations(userId);
      if (res.success && res.data) {
        // Filter conversations matching the selectedAppId to keep workspace clean
        const filtered = res.data.filter(
          (c) => !selectedApp || c.appId === selectedApp.appId
        );
        setConversations(filtered);
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    }
  }, [tenant, selectedApp]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load active conversation messages
  useEffect(() => {
    async function loadActiveMessages() {
      if (!activeConversationId) {
        setMessages([]);
        return;
      }
      try {
        const res = await getConversation(activeConversationId);
        if (res.success && res.data) {
          setMessages(res.data.messages || []);
        }
      } catch (err) {
        console.error("Failed to load conversation messages:", err);
        toast.error("Failed to retrieve chat history.");
      }
    }
    loadActiveMessages();
  }, [activeConversationId]);

  // Handle switching apps
  const handleAppChange = (appId) => {
    const appObj = apps.find((a) => a.appId === appId);
    if (appObj) {
      setSelectedApp(appObj);
      setSelectedDocId("all"); // Reset document filter
      setActiveConversationId(null); // Clear active conversation
    }
  };

  // Start new conversation turn
  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    toast.success("Started a new chat session.");
  };

  // Delete conversation
  const handleDeleteConversation = async (conversationId) => {
    try {
      const res = await deleteConversation(conversationId);
      if (res.success) {
        toast.success("Conversation deleted.");
        if (activeConversationId === conversationId) {
          setActiveConversationId(null);
        }
        loadConversations();
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
      toast.error("Could not delete conversation.");
    }
  };

  // Send message
  const handleSendMessage = async (userPrompt) => {
    if (!userPrompt || !userPrompt.trim()) return;
    if (!selectedApp) {
      toast.error("Please select or create an app first.");
      return;
    }

    const userId = tenant?.tenantId;
    if (!userId) {
      toast.error("User context is not fully loaded yet.");
      return;
    }

    // 1. Append user prompt locally
    const userMsg = {
      role: "user",
      content: userPrompt,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 2. Build RAG query parameters
      const requestData = {
        userPrompt,
        appId: selectedApp.appId,
        groupId: undefined,
        docId: selectedDocId === "all" ? undefined : selectedDocId,
        topK: topK,
        conversationId: activeConversationId || undefined,
        userId: userId,
      };

      // 3. Request LLM generation matching tenant credentials
      const res = await askLlm(requestData);

      if (res.success && res.data) {
        const { answer, citations, conversationId: newConvId } = res.data;

        // Update active thread context
        if (!activeConversationId && newConvId) {
          setActiveConversationId(newConvId);
          loadConversations();
        }

        // 4. Append assistant response
        const assistantMsg = {
          role: "assistant",
          content: answer,
          citations: citations || [],
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(res.message || "Failed to generate answer.");
      }
    } catch (err) {
      console.error("RAG Ask LLM Failed:", err);
      toast.error(err.message || "Failed to generate RAG response.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter documents matching the selected App's workspace groups
  const filteredDocs = documents.filter(
    (doc) => !selectedApp || doc.group?.appId === selectedApp.appId
  );

  return (
    <div className="flex h-screen w-full relative bg-[#051424] text-[#d5e4fa] overflow-hidden selection:bg-[#6C5CE7]/30">
      {/* Styles Injection */}
      <style>{`
        .grid-texture {
          background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .glass-panel {
          background: rgba(17, 20, 28, 0.75);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .blinking-cursor {
          display: inline-block;
          width: 2px;
          height: 1.2em;
          background-color: #6C5CE7;
          animation: blink 1s step-end infinite;
          vertical-align: middle;
          margin-left: 2px;
        }
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
        .pulse-dot {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .3; }
        }
      `}</style>

      {/* Grid Overlay Layer */}
      <div className="absolute inset-0 grid-texture pointer-events-none opacity-20 z-0"></div>

      {/* Ambient background glow orbs */}
      <div className="absolute -top-[300px] -left-[200px] w-[600px] h-[600px] rounded-full bg-[#6C5CE7] opacity-[0.03] blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute -bottom-[300px] -right-[200px] w-[600px] h-[600px] rounded-full bg-[#C6BFFF] opacity-[0.03] blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }}></div>

      {/* PANEL 1: SIDEBAR (Shared Navigation Layout) */}
      <SideBar />

      {/* Workspace Content offset by SideBar (ml-64) */}
      <div className="flex flex-1 ml-64 h-full relative z-10">
        {/* PANEL 2: CHAT HISTORY (Collapsible panel) */}
        <ChatHistoryComp
          isOpen={isHistoryOpen}
          onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
          onDeleteConversation={handleDeleteConversation}
          onNewChat={handleNewChat}
          apps={apps}
        />

        {/* PANEL 3: CHAT AREA */}
        <main className="flex-1 bg-transparent flex flex-col relative z-10">
          {/* Navigation / Chat Settings Header */}
          <ConversationNavComp
            apps={apps}
            selectedApp={selectedApp}
            onAppChange={handleAppChange}
            documents={filteredDocs}
            selectedDocId={selectedDocId}
            onDocChange={setSelectedDocId}
            rerankerOn={rerankerOn}
            onRerankerToggle={() => setRerankerOn(!rerankerOn)}
            isHistoryOpen={isHistoryOpen}
            onExpandHistory={() => setIsHistoryOpen(true)}
          />

          {/* Chat Messages Canvas */}
          <ChatInterFaceComp
            messages={messages}
            isLoading={isLoading}
          />

          {/* Prompts Ingestion Footer Input */}
          <UserPromptBoxComp
            onSend={handleSendMessage}
            isLoading={isLoading}
            topK={topK}
            setTopK={setTopK}
            temp={temp}
            setTemp={setTemp}
            strategy={strategy}
            setStrategy={setStrategy}
          />
        </main>
      </div>
    </div>
  );
}