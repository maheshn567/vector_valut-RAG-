import { useEffect, useRef, useState } from "react";
import LLM_response_fromater from "../../utility/LLM_response_fromater.jsx";

export default function ChatInterFaceComp({ messages = [], isLoading }) {
  const canvasRef = useRef(null);
  const [selectedCitation, setSelectedCitation] = useState(null);

  // Auto-scroll to bottom of the canvas when messages or loading states update
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.scrollTo({
        top: canvasRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  return (
    <section
      ref={canvasRef}
      className="flex-1 overflow-y-auto p-8 flex justify-center scrollbar-thin"
    >
      <div className="w-full max-w-[760px] space-y-8 pb-32">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4 opacity-60">
            <span className="material-symbols-outlined text-[48px] text-[#e4deff]">
              forum
            </span>
            <div>
              <h3 className="font-headline-md text-[18px] text-primary">
                Semantic RAG Chat Workspace
              </h3>
              <p className="text-[13px] text-on-surface-variant max-w-[400px] mt-1">
                Select an Application and document context above, then type your
                query to begin search synthesis.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === "user";
            const formattedTime = new Date(msg.timestamp || new Date()).toLocaleTimeString(
              undefined,
              { hour: "2-digit", minute: "2-digit", hour12: false }
            );

            if (isUser) {
              return (
                <div key={index} className="flex flex-col items-end gap-2">
                  <div className="max-w-[85%] bg-[#6C5CE7] text-white px-5 py-3 rounded-2xl rounded-tr-none shadow-lg">
                    <p className="font-body-lg text-[15px]">{msg.content}</p>
                  </div>
                  <span className="text-[10px] font-mono text-on-surface-variant">
                    {formattedTime}
                  </span>
                </div>
              );
            }

            return (
              <div key={index} className="flex flex-col gap-4">
                {/* AI Header Profile */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary/30">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      bolt
                    </span>
                  </div>
                  <span className="text-[12px] font-bold text-primary font-mono">
                    Vector Vault AI
                  </span>
                  <span className="px-2 py-0.5 bg-[#6C5CE7]/10 text-[#6C5CE7] border border-[#6C5CE7]/20 text-[9px] font-bold rounded uppercase">
                    RAG v2
                  </span>
                </div>

                {/* AI Response Panel */}
                <div className="glass-panel rounded-2xl border-l-4 border-l-[#6C5CE7] p-6 space-y-4">
                  <LLM_response_fromater response={msg.content} />

                  {/* Retrieved Citations Section */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-4 border-t border-white/5">
                      <h4 className="text-[10px] uppercase font-bold text-on-surface-variant mb-3 tracking-widest font-mono">
                        Retrieved Citations
                      </h4>
                      <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin">
                        {msg.citations.map((citation, citIdx) => (
                          <div
                            key={citIdx}
                            onClick={() => setSelectedCitation(citation)}
                            className="min-w-[200px] max-w-[240px] bg-[#0e1c2d] border border-white/5 p-3 rounded-lg hover:border-[#6C5CE7]/50 hover:bg-[#122031] transition-all cursor-pointer shrink-0"
                            title="Click to view full cited text chunk"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-bold text-primary truncate w-24">
                                {citation.docName || "Document Reference"}
                              </span>
                              {citation.similarity !== undefined && (
                                <span className="text-[10px] font-mono text-[#6dfad2]">
                                  {(citation.similarity * 100).toFixed(0)}% Score
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-on-surface-variant line-clamp-2 italic">
                              {citation.text || "Click to preview citation chunk details..."}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-mono text-on-surface-variant">
                  {formattedTime}
                </span>
              </div>
            );
          })
        )}

        {/* AI Loading/Thinking State Indicator */}
        {isLoading && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary/30">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  bolt
                </span>
              </div>
              <span className="text-[12px] font-bold text-primary font-mono">
                Vector Vault AI
              </span>
            </div>
            <div className="pl-11">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 py-1 px-3 bg-[#6dfad2]/5 rounded border border-[#6dfad2]/10 w-fit">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6dfad2] pulse-dot"></span>
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#6dfad2] pulse-dot"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#6dfad2] pulse-dot"
                      style={{ animationDelay: "0.4s" }}
                    ></span>
                  </div>
                  <span className="text-[11px] font-mono text-[#6dfad2] uppercase tracking-tighter">
                    Retrieving Knowledge Sources...
                  </span>
                </div>
                <div className="text-[14px] text-on-surface/60 font-medium">
                  Scanning database vectors and synthesizing RAG context...
                  <span className="blinking-cursor"></span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Bottom spacing spacer so prompt box doesn't overlap text when scrolled to bottom */}
        <div className="h-44 shrink-0 pointer-events-none"></div>
      </div>

      {/* Citation Detail Inspector Modal */}
      {selectedCitation && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#11141C] border border-white/10 rounded-xl max-w-[600px] w-full shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-[#0B0E17]">
              <div>
                <h3 className="font-headline-md text-[16px] text-primary">
                  Citation Context Detail
                </h3>
                <p className="text-[11px] text-on-surface-variant font-mono mt-0.5">
                  Source: {selectedCitation.docName || "Unknown Document"}
                </p>
              </div>
              <button
                onClick={() => setSelectedCitation(null)}
                className="p-1 hover:bg-white/5 rounded text-on-surface-variant hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {/* Content Body */}
            <div className="p-6 max-h-[400px] overflow-y-auto text-[13px] leading-relaxed text-on-surface/90 font-sans whitespace-pre-wrap select-text selection:bg-[#6C5CE7]/40 bg-transparent scrollbar-thin">
              {selectedCitation.text || "No snippet content preview is available for this citation."}
            </div>
            {/* Footer */}
            <div className="px-6 py-3 border-t border-white/5 bg-[#0B0E17] flex justify-between items-center text-[11px] font-mono">
              <span className="text-on-surface-variant">
                ID: {selectedCitation.chunk_id || "N/A"}
              </span>
              {selectedCitation.similarity !== undefined && (
                <span className="text-[#6dfad2] font-semibold">
                  Match Score: {(selectedCitation.similarity * 100).toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}