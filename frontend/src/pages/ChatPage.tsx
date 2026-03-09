import { useState, useRef, useEffect, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadAndSummarize, sendChatMessage } from '../api';
import type { ChatMessage } from '../types';
import ChatMessageComponent from '../components/ChatMessage';
import FileUpload from '../components/FileUpload';

export default function ChatPage() {
  const { username, logout } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function addMessage(
    role: ChatMessage['role'],
    content: string,
    summary?: ChatMessage['summary'],
  ) {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      summary,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  }

  async function handleFileUpload(file: File) {
    setUploading(true);
    addMessage('user', `📄 Uploaded: ${file.name}`);

    try {
      const result = await uploadAndSummarize(file);
      setCurrentFileId(result.fileId);
      setCurrentFileName(result.fileName);
      addMessage(
        'assistant',
        `Analysis complete for "${result.fileName}"`,
        result.summary,
      );
    } catch (err) {
      addMessage(
        'assistant',
        `Failed to analyze file: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setInput('');
    setSending(true);
    addMessage('user', text);

    try {
      const result = await sendChatMessage(
        text,
        currentFileId ?? undefined,
      );
      addMessage('assistant', result.response);
    } catch (err) {
      addMessage(
        'assistant',
        `Error: ${err instanceof Error ? err.message : 'Failed to get response'}`,
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="chat-header-left">
          <h1>Matter Analyzer</h1>
          {currentFileName && (
            <span className="active-file">📄 {currentFileName}</span>
          )}
        </div>
        <div className="chat-header-right">
          <span className="username">{username}</span>
          <button onClick={logout} className="btn-logout">
            Sign Out
          </button>
        </div>
      </header>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <h2>Welcome to Matter Analyzer</h2>
            <p>Upload a legal document to get started, or type a message below.</p>
            <p className="supported-formats">
              Supported formats: .txt, .md, .pdf
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessageComponent key={msg.id} message={msg} />
        ))}
        {(sending || uploading) && (
          <div className="message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-body">
              <div className="message-content typing-indicator">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <FileUpload
          onFileSelect={handleFileUpload}
          disabled={uploading || sending}
          uploading={uploading}
        />
        <form className="chat-form" onSubmit={handleSend}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              currentFileId
                ? 'Ask a follow-up question about the document...'
                : 'Type a message...'
            }
            disabled={sending || uploading}
          />
          <button
            type="submit"
            className="btn-send"
            disabled={!input.trim() || sending || uploading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
