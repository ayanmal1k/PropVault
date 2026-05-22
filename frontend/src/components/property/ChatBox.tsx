"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { api } from "@/lib/api";

/* ── Types ── */
interface ChatUser { id: string; firstName: string; lastName: string; avatar?: string | null; }
interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  sender: ChatUser;
  senderId: string;
}
interface ChatRoom { id: string; }

interface Props {
  propertyId: string;
  propertyTitle: string;
}

/* ── Helpers ── */
function timeStr(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function Avatar({ user, size = 32 }: { user: ChatUser; size?: number }) {
  if (user.avatar) return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={user.avatar} alt="" width={size} height={size}
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
  );
  return (
    <span style={{
      width: size, height: size, borderRadius: "50%", background: "#33a137",
      color: "#fff", fontWeight: 700, fontSize: size * 0.38,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      {user.firstName[0]}
    </span>
  );
}

/* ── Guest form shown when not logged in ── */
function GuestInquiryForm({ propertyId, propertyTitle }: { propertyId: string; propertyTitle: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const f = new FormData(e.currentTarget);
    try {
      await api("/leads/inquiry", {
        method: "POST",
        body: JSON.stringify({
          propertyId,
          name: f.get("name"),
          email: f.get("email"),
          phone: f.get("phone"),
          body: f.get("message") || `I am interested in: ${propertyTitle}`,
          whatsapp: false,
        }),
      });
      setStatus("ok");
      (e.target as HTMLFormElement).reset();
    } catch { setStatus("err"); }
  }

  return (
    <div>
      <div style={{ padding: "12px 14px", background: "#f8f8f8", borderBottom: "1px solid #e0e0e0", fontSize: 13, color: "#555" }}>
        <strong style={{ color: "#33a137" }}>Send an enquiry</strong> — or{" "}
        <a href="/auth/login" style={{ color: "#33a137", textDecoration: "underline" }}>login</a> to chat live.
      </div>
      <form onSubmit={submit} style={{ padding: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input name="name" required placeholder="Your name" style={inputStyle} />
          <input name="email" type="email" required placeholder="Email address" style={inputStyle} />
          <input name="phone" placeholder="Phone number" style={inputStyle} />
          <textarea name="message" rows={3} placeholder={`I am interested in: ${propertyTitle}`} style={{ ...inputStyle, resize: "vertical" }} />
          <button type="submit" disabled={status === "loading"} style={btnStyle}>
            {status === "loading" ? "Sending…" : "Send Enquiry"}
          </button>
          {status === "ok" && <p style={{ color: "#33a137", fontSize: 12 }}>Message sent! The agent will respond shortly.</p>}
          {status === "err" && <p style={{ color: "#c00", fontSize: 12 }}>Failed — please try again.</p>}
        </div>
      </form>
    </div>
  );
}

/* ── Styles ── */
const inputStyle: React.CSSProperties = {
  border: "1px solid #ccc", borderRadius: 3, padding: "8px 10px",
  fontSize: 13, width: "100%", outline: "none",
};
const btnStyle: React.CSSProperties = {
  background: "#33a137", color: "#fff", border: "none", borderRadius: 3,
  padding: "9px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%",
};

/* ── Main Chat component ── */
export function ChatBox({ propertyId, propertyTitle }: Props) {
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState<ChatUser | null>(null);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const socketRef = useRef<import("socket.io-client").Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* Check auth on mount */
  useEffect(() => {
    api<ChatUser>("/users/me", { timeoutMs: 3000 }).then(setMe).catch(() => setMe(null));
  }, []);

  /* Scroll to bottom */
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  /* Open chat — create/fetch room + history */
  const openChat = useCallback(async () => {
    if (!me) { setOpen(true); return; }
    setOpen(true);
    setUnread(0);
    if (room) return;
    setLoading(true);
    try {
      const r = await api<ChatRoom>("/chat/rooms", {
        method: "POST",
        body: JSON.stringify({ propertyId }),
      });
      setRoom(r);
      const msgs = await api<ChatMessage[]>(`/chat/rooms/${r.id}/messages`);
      setMessages(msgs);

      /* Connect socket */
      const { io } = await import("socket.io-client");
      const sock = io(process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "http://localhost:4000", {
        transports: ["websocket", "polling"],
      });
      socketRef.current = sock;
      sock.emit("join-room", r.id);
      sock.on("chat-message", (msg: ChatMessage) => {
        setMessages((prev) => [...prev, msg]);
        if (!open) setUnread((n) => n + 1);
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [me, room, propertyId, open]);

  /* Cleanup socket */
  useEffect(() => () => { socketRef.current?.disconnect(); }, []);

  async function sendMessage() {
    if (!draft.trim() || !room || !me) return;
    setSending(true);
    const content = draft.trim();
    setDraft("");

    /* optimistic */
    const optimistic: ChatMessage = {
      id: `tmp-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      sender: me,
      senderId: me.id,
    };
    setMessages((prev) => [...prev, optimistic]);

    if (socketRef.current?.connected) {
      socketRef.current.emit("chat-message", { roomId: room.id, senderId: me.id, content });
    } else {
      /* REST fallback */
      try {
        const saved = await api<ChatMessage>(`/chat/rooms/${room.id}/messages`, {
          method: "POST",
          body: JSON.stringify({ content }),
        });
        setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? saved : m)));
      } catch { /* keep optimistic */ }
    }
    setSending(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  /* ── Render ── */
  return (
    <div style={{ border: "1px solid #e0e0e0", borderRadius: 3, overflow: "hidden", background: "#fff" }}>
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openChat())}
        style={{
          width: "100%", background: "#33a137", color: "#fff", border: "none",
          padding: "11px 14px", display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer", fontSize: 13, fontWeight: 700,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/>
          </svg>
          Chat with {me ? "Seller" : "Agent / Send Enquiry"}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {unread > 0 && !open && (
            <span style={{
              background: "#e53e3e", borderRadius: "50%", width: 18, height: 18,
              fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center",
            }}>{unread}</span>
          )}
          <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor"
            style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <path d="M0 0l6 8 6-8z"/>
          </svg>
        </span>
      </button>

      {/* Body */}
      {open && (
        <div>
          {!me ? (
            <GuestInquiryForm propertyId={propertyId} propertyTitle={propertyTitle} />
          ) : loading ? (
            <div style={{ padding: 32, textAlign: "center", color: "#888", fontSize: 13 }}>Connecting…</div>
          ) : (
            <>
              {/* Messages */}
              <div style={{ height: 300, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10, background: "#f9f9f9" }}>
                {messages.length === 0 && (
                  <div style={{ textAlign: "center", color: "#bbb", fontSize: 13, margin: "auto" }}>
                    No messages yet. Start the conversation!
                  </div>
                )}
                {messages.map((msg) => {
                  const isMe = msg.senderId === me.id;
                  return (
                    <div key={msg.id} style={{
                      display: "flex", gap: 8, flexDirection: isMe ? "row-reverse" : "row", alignItems: "flex-end",
                    }}>
                      {!isMe && <Avatar user={msg.sender} size={28} />}
                      <div style={{ maxWidth: "72%" }}>
                        <div style={{
                          background: isMe ? "#33a137" : "#fff",
                          color: isMe ? "#fff" : "#333",
                          border: isMe ? "none" : "1px solid #e0e0e0",
                          borderRadius: isMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                          padding: "8px 12px",
                          fontSize: 13,
                          lineHeight: 1.45,
                          wordBreak: "break-word",
                        }}>
                          {msg.content}
                        </div>
                        <div style={{ fontSize: 10, color: "#bbb", marginTop: 2, textAlign: isMe ? "right" : "left" }}>
                          {timeStr(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ borderTop: "1px solid #e0e0e0", padding: 10, display: "flex", gap: 8, background: "#fff" }}>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Type a message… (Enter to send)"
                  rows={1}
                  style={{
                    flex: 1, border: "1px solid #ccc", borderRadius: 3, padding: "8px 10px",
                    fontSize: 13, resize: "none", outline: "none", fontFamily: "inherit",
                  }}
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!draft.trim() || sending}
                  style={{
                    background: draft.trim() ? "#33a137" : "#ccc",
                    color: "#fff", border: "none", borderRadius: 3,
                    padding: "0 14px", cursor: draft.trim() ? "pointer" : "default", fontSize: 13,
                    display: "flex", alignItems: "center", gap: 4,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
