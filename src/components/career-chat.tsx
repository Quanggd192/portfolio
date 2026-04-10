"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { suggestedQuestions } from "@/lib/profile";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const openingMessage =
  "Hi, I'm Nguyen Quang's digital twin. I can answer like I would in a recruiter or client conversation about my background, technical strengths, leadership style, and career journey.";

export function CareerChat() {
  const logEndRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: openingMessage },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasStartedChat = messages.some((message) => message.role === "user");

  async function submitQuestion(question: string) {
    const trimmed = question.trim();

    if (!trimmed || isLoading) {
      return;
    }

    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsOpen(true);
    setIsLoading(true);

    try {
      const response = await fetch("/api/career-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages
            .filter((message) => message.content !== openingMessage)
            .map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = (await response.json()) as { answer?: string; error?: string };

      if (!response.ok || !data.answer) {
        throw new Error(data.error || "Unable to generate a response right now.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.answer as string },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected chat error.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitQuestion(input);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    logEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isLoading, isOpen]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className={`floating-chat ${isOpen ? "floating-chat-open" : ""}`}>
      {isOpen ? (
        <section className="floating-chat-panel">
          <div className="floating-chat-topbar">
            <div className="floating-chat-avatar">NQ</div>
            <div className="floating-chat-identity">
              <h2 className="floating-chat-name">Digital Twin AI</h2>
              <p className="floating-chat-status">Online & ready</p>
            </div>
            <button
              type="button"
              className="floating-chat-close floating-chat-close-inline"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              x
            </button>
          </div>

          <div className="floating-chat-body">
            <div className="chat-log floating-chat-log" aria-live="polite">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`chat-row chat-row-${message.role}`}
                >
                  <div className={`chat-message chat-message-${message.role}`}>
                    <p className="chat-message-content">{message.content}</p>
                  </div>
                </div>
              ))}

              {isLoading ? (
                <div className="chat-row chat-row-assistant">
                  <div className="chat-message chat-message-assistant">
                    <div
                      className="typing-indicator"
                      aria-label="Digital twin is typing"
                    >
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              ) : null}

              <div ref={logEndRef} />
            </div>

            {!hasStartedChat ? (
              <div className="floating-chat-quick">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={question}
                    type="button"
                    className="floating-chat-chip"
                    onClick={() => void submitQuestion(question)}
                    disabled={isLoading}
                  >
                    <span className="floating-chat-chip-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="floating-chat-chip-text">{question}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <form className="floating-chat-composer" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="career-chat-input">
              Ask a question about Nguyen Quang
            </label>
            <input
              id="career-chat-input"
              className="floating-chat-input"
              placeholder="Ask about my stack or experience..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="floating-chat-send"
              disabled={isLoading}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M20.2 3.8 3.8 10.5c-.9.4-.8 1.7.2 1.9l5.8 1.4 1.4 5.8c.2 1 1.5 1.1 1.9.2l6.7-16.4c.4-1-.6-2-1.6-1.6Zm-7.7 13.7-1-4.1a1 1 0 0 0-.7-.7l-4.1-1 10.4-4.3-4.6 10.1Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </form>

          {error ? <p className="floating-chat-error">{error}</p> : null}
        </section>
      ) : null}

      <div className="floating-chat-controls">
        <button
          type="button"
          className="floating-chat-trigger"
          onClick={() => setIsOpen((current) => !current)}
          aria-label={isOpen ? "Close digital twin chat" : "Open digital twin chat"}
          aria-expanded={isOpen}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6 5.5h12A2.5 2.5 0 0 1 20.5 8v7a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 3v-3H6A2.5 2.5 0 0 1 3.5 15V8A2.5 2.5 0 0 1 6 5.5Zm0 2A.5.5 0 0 0 5.5 8v7c0 .3.2.5.5.5h2.5v1.3l1.9-1.3H18a.5.5 0 0 0 .5-.5V8a.5.5 0 0 0-.5-.5H6Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>,
    document.body,
  );
}
