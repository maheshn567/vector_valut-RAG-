import { useState } from "react";

export default function ChatHistoryComp({
  isOpen,
  onToggle,
  conversations = [],
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewChat,
  apps = [],
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Helper to map appId to application details (name)
  const getAppName = (appId) => {
    const app = apps.find((a) => a.appId === appId);
    return app ? app.appName : "Unknown App";
  };

  // Helper to resolve app color classes based on app name to match high-fidelity specs
  const getAppStyle = (appId) => {
    const name = getAppName(appId).toLowerCase();
    if (name.includes("legal")) {
      return "bg-primary/10 text-primary border-primary/20";
    } else if (name.includes("support") || name.includes("customer")) {
      return "bg-tertiary-container/10 text-tertiary border-tertiary-container/20";
    } else {
      return "bg-orange-400/10 text-orange-400 border-orange-400/20";
    }
  };

  // Search filtering
  const filteredList = conversations.filter((c) => {
    const title = (c.metadata?.title || `Session ${c.conversationId.slice(0, 5)}`).toLowerCase();
    const appName = getAppName(c.appId).toLowerCase();
    return title.includes(searchQuery.toLowerCase()) || appName.includes(searchQuery.toLowerCase());
  });

  // Date grouping helper
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const todayList = [];
  const yesterdayList = [];
  const olderList = [];

  filteredList.forEach((c) => {
    const cDate = new Date(c.createdAt || c.updatedAt);
    if (cDate >= startOfToday) {
      todayList.push(c);
    } else if (cDate >= startOfYesterday) {
      yesterdayList.push(c);
    } else {
      olderList.push(c);
    }
  });

  const renderChatItem = (c) => {
    const isActive = c.conversationId === activeConversationId;
    const title = c.metadata?.title || `Chat ${new Date(c.createdAt).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    return (
      <div
        key={c.conversationId}
        onClick={() => onSelectConversation(c.conversationId)}
        className={`p-3 rounded-lg cursor-pointer group border transition-all relative ${
          isActive
            ? "bg-[#1d2b3c] border-[#6C5CE7]/40 shadow-lg text-[#e4deff]"
            : "border-white/5 hover:border-[#6C5CE7]/30 hover:bg-white/5 text-on-surface"
        }`}
      >
        {/* Delete button (displays on hover) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("Are you sure you want to delete this chat thread?")) {
              onDeleteConversation(c.conversationId);
            }
          }}
          className="absolute right-2 top-2 p-1 text-on-surface-variant hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-white/5 z-20 cursor-pointer"
          title="Delete chat"
        >
          <span className="material-symbols-outlined text-[16px]">delete</span>
        </button>

        <div className="flex justify-between items-start mb-1 pr-6">
          <span className={`text-[12px] truncate w-40 font-medium ${isActive ? "text-primary" : "text-on-surface"}`}>
            {title}
          </span>
          <span className="text-[10px] text-on-surface-variant font-mono shrink-0">
            {new Date(c.updatedAt || c.createdAt).toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </span>
        </div>

        <p className="text-[11px] text-on-surface-variant line-clamp-1 mb-2">
          {c.metadata?.lastMessageExcerpt || "Click to resume conversation"}
        </p>

        <span
          className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold tracking-tight uppercase border ${getAppStyle(
            c.appId
          )}`}
        >
          {getAppName(c.appId)}
        </span>
      </div>
    );
  };

  return (
    <aside
      className={`bg-[#0B0E17] border-r border-white/5 flex flex-col z-20 shrink-0 transition-all duration-300 overflow-hidden ${
        isOpen ? "w-[280px] opacity-100" : "w-0 opacity-0 pointer-events-none"
      }`}
    >
      {/* Collapse History Header */}
      <div className="flex justify-end p-2 border-b border-white/5">
        <button
          onClick={onToggle}
          className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-md transition-all cursor-pointer"
          title="Collapse Panel"
        >
          <span className="material-symbols-outlined text-[20px]">menu_open</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* New Chat CTA */}
        <button
          onClick={onNewChat}
          className="w-full py-2.5 bg-[#6C5CE7]/10 text-[#6C5CE7] font-bold border border-[#6C5CE7]/20 rounded-lg hover:bg-[#6C5CE7]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span className="text-[12px] font-mono tracking-wide uppercase">New Chat</span>
        </button>

        {/* Search Filter */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#051424] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-[12px] font-mono text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-[#6C5CE7]/50"
            placeholder="Search conversations..."
          />
        </div>
      </div>

      {/* Grouped lists */}
      <div className="flex-1 overflow-y-auto px-2 space-y-6 pb-6 scrollbar-thin">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-xs text-on-surface-variant italic">
            No active conversations
          </div>
        ) : (
          <>
            {/* Date Group: Today */}
            {todayList.length > 0 && (
              <div>
                <h3 className="px-3 mb-2 text-[10px] uppercase tracking-widest text-on-surface-variant font-mono">
                  Today
                </h3>
                <div className="space-y-1">{todayList.map(renderChatItem)}</div>
              </div>
            )}

            {/* Date Group: Yesterday */}
            {yesterdayList.length > 0 && (
              <div>
                <h3 className="px-3 mb-2 text-[10px] uppercase tracking-widest text-on-surface-variant font-mono">
                  Yesterday
                </h3>
                <div className="space-y-1">{yesterdayList.map(renderChatItem)}</div>
              </div>
            )}

            {/* Date Group: Older */}
            {olderList.length > 0 && (
              <div>
                <h3 className="px-3 mb-2 text-[10px] uppercase tracking-widest text-on-surface-variant font-mono">
                  Older Chats
                </h3>
                <div className="space-y-1">{olderList.map(renderChatItem)}</div>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}