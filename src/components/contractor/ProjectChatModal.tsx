'use client';

import React, { useState } from 'react';
import { ProjectLead, Message } from '@/lib/supabase/types';
import { MOCK_MESSAGES } from '@/lib/mock-data';
import { X, Send, Phone, CheckCheck } from 'lucide-react';
import { Button } from '../ui/button';

interface ProjectChatModalProps {
  lead: ProjectLead | null;
  onClose: () => void;
}

export function ProjectChatModal({ lead, onClose }: ProjectChatModalProps) {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');

  if (!lead) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: 'msg-' + Date.now(),
      project_id: lead.id,
      sender_id: '11111111-1111-1111-1111-111111111111',
      receiver_id: lead.client_id || 'client-id',
      content: inputText.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden flex flex-col h-[600px] animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 bg-stone-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white font-bold">
              {lead.client_name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{lead.client_name}</h3>
              <p className="text-xs text-stone-400">
                {lead.room_type} ({lead.location_city})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${lead.client_phone}`}
              className="inline-flex items-center gap-1 rounded-lg bg-stone-800 px-3 py-1.5 text-xs text-stone-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lead.client_phone}</span>
            </a>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat message history */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-50/50">
          <div className="text-center">
            <span className="text-[11px] text-stone-400 bg-white border border-stone-200 px-3 py-1 rounded-full">
              Päring algatatud Plaatija24 platvormil
            </span>
          </div>

          {messages.map((m) => {
            const isMe = m.sender_id === '11111111-1111-1111-1111-111111111111';

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    isMe
                      ? 'bg-orange-600 text-white rounded-br-xs'
                      : 'bg-white border border-stone-200 text-stone-900 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {m.content}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-1 px-1">
                  <span>
                    {new Date(m.created_at).toLocaleTimeString('et-EE', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {isMe && <CheckCheck className="w-3 h-3 text-orange-600" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="border-t border-stone-200 p-4 bg-white shrink-0 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Kirjuta vastus tellijale..."
            className="flex-1 rounded-lg border border-stone-300 px-4 py-2.5 text-xs text-stone-900 focus:border-orange-500 focus:outline-none"
          />
          <Button variant="amber" size="default" type="submit" className="gap-1.5">
            <Send className="w-4 h-4" />
            <span>Saada</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
