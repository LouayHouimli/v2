import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useChatMutate } from "~/lib/actions/chat.actions";
import { Button } from "~/lib/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function MessageBubble({
  message,
  isStreaming = false,
}: {
  message: Message;
  isStreaming?: boolean;
}) {
  return (
    <div
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-6`}
    >
      <div
        className={`flex items-start gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${message.role === "user" ? "bg-black" : "bg-gray-100"}`}
        >
          {message.role === "user" ? "👤" : "🤖"}
        </div>
        <div
          className={`rounded-lg px-4 py-3 ${message.role === "user" ? "bg-black text-white" : "bg-gray-50"}`}
        >
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                code({ inline, className, children, ...props }: CodeProps) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      {...props}
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-lg my-2"
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      {...props}
                      className={`px-1.5 py-0.5 rounded ${message.role === "user" ? "bg-gray-800" : "bg-gray-200"}`}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

function RouteComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streamingContent, setStreamingContent] = useState("");
  const { mutateAsync } = useChatMutate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  const handleSubmit = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setStreamingContent("");

    const stream = await mutateAsync([...messages, userMessage]);
    let buffer = "";
    let lastUpdate = Date.now();
    const updateInterval = 16;

    for await (const chunk of stream) {
      buffer += chunk;
      const now = Date.now();
      if (now - lastUpdate >= updateInterval) {
        setStreamingContent(buffer);
        lastUpdate = now;
      }
    }

    setMessages((prev) => [...prev, { role: "assistant", content: buffer }]);
    setStreamingContent("");
  }, [input, messages, mutateAsync]);

  return (
    <div className="flex flex-col h-[80vh] bg-white rounded-lg shadow-lg mx-auto my-8 max-w-3xl">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
          {streamingContent && (
            <MessageBubble
              message={{ role: "assistant", content: streamingContent }}
              isStreaming
            />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-gray-100 bg-white p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="flex-1 border border-gray-200 rounded-md px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50"
              placeholder="Type your message..."
            />
            <Button
              onClick={handleSubmit}
              className="bg-black hover:bg-gray-800 transition-colors duration-200"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/chat/")({
  component: RouteComponent,
});
