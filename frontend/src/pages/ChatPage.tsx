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
    addMessage('user', `📄 Enviado: ${file.name}`);

    try {
      const result = await uploadAndSummarize(file);
      setCurrentFileId(result.fileId);
      setCurrentFileName(result.fileName);
      addMessage(
        'assistant',
        `Análise concluída para "${result.fileName}"`,
        result.summary,
      );
    } catch (err) {
      addMessage(
        'assistant',
        `Falha ao analisar arquivo: ${err instanceof Error ? err.message : 'Erro desconhecido'}`,
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
        `Erro: ${err instanceof Error ? err.message : 'Falha ao obter resposta'}`,
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="chat-header-left">
          <img src="/icon-48.png" alt="JustiFlow" className="chat-header-icon" />
          <h1>JustiFlow</h1>
          {currentFileName && (
            <span className="active-file">📄 {currentFileName}</span>
          )}
        </div>
        <div className="chat-header-right">
          <span className="username">{username}</span>
          <button onClick={logout} className="btn-logout">
            Sair
          </button>
        </div>
      </header>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <img src="/logo.png" alt="JustiFlow" className="welcome-logo" />
            <h2>Bem-vindo ao JustiFlow</h2>
            <p>Envie um documento jurídico para começar, ou digite uma mensagem abaixo.</p>
            <p className="supported-formats">
              Formatos aceitos: .txt, .md, .pdf
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
                ? 'Faça uma pergunta sobre o documento...'
                : 'Digite uma mensagem...'
            }
            disabled={sending || uploading}
          />
          <button
            type="submit"
            className="btn-send"
            disabled={!input.trim() || sending || uploading}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
