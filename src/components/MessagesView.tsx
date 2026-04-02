import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../utils/colors';
import { t } from '../utils/translations';
import { getInitials, formatTime } from '../utils/format';

export default function MessagesView() {
  const { user, lang } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeConv) loadMessages(activeConv);
  }, [activeConv]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadConversations() {
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });
    setConversations(data || []);
    if (data?.length) setActiveConv(data[0].id);
    setLoading(false);
  }

  async function loadMessages(convId: string) {
    const { data } = await supabase
      .from('messages')
      .select('*, app_users:sender_id(name, role, profile_photo)')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });
    setMessages(data || []);
  }

  async function sendMessage() {
    if (!newMsg.trim() || !activeConv || !user) return;
    await supabase.from('messages').insert({
      conversation_id: activeConv,
      sender_id: user.id,
      content: newMsg.trim(),
    });
    setNewMsg('');
    loadMessages(activeConv);
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: theme.textSecondary }}>
        {t('loading', lang)}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div
        style={{
          width: '280px',
          borderRight: `1px solid ${theme.border}`,
          background: theme.card,
          overflowY: 'auto',
          flexShrink: 0,
        }}
      >
        <div style={{ padding: '16px', borderBottom: `1px solid ${theme.border}`, fontWeight: 600, color: theme.text }}>
          {t('messages', lang)}
        </div>
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => setActiveConv(conv.id)}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              background: activeConv === conv.id ? `${theme.primary}10` : 'transparent',
              borderBottom: `1px solid ${theme.borderLight}`,
              transition: 'background 0.1s',
            }}
          >
            <div style={{ fontWeight: 500, color: theme.text, fontSize: '14px' }}>
              {conv.title || conv.id?.slice(0, 12)}
            </div>
          </div>
        ))}
        {conversations.length === 0 && (
          <div style={{ padding: '40px 16px', textAlign: 'center', color: theme.textSecondary, fontSize: '13px' }}>
            {t('noData', lang)}
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {messages.map((msg) => {
            const isMine = msg.sender_id === user?.id;
            const sender = msg.app_users;
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isMine ? 'flex-end' : 'flex-start',
                  marginBottom: '12px',
                }}
              >
                <div style={{ maxWidth: '70%' }}>
                  {!isMine && sender && (
                    <div style={{ fontSize: '11px', color: theme.textSecondary, marginBottom: '4px', marginLeft: '4px' }}>
                      {sender.name}
                    </div>
                  )}
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: isMine ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      background: isMine ? theme.primary : theme.borderLight,
                      color: isMine ? '#fff' : theme.text,
                      fontSize: '14px',
                      lineHeight: 1.5,
                    }}
                  >
                    {msg.content}
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: theme.textSecondary,
                      marginTop: '4px',
                      textAlign: isMine ? 'right' : 'left',
                      paddingLeft: '4px',
                      paddingRight: '4px',
                    }}
                  >
                    {formatTime(msg.created_at)}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {activeConv && (
          <div
            style={{
              padding: '12px 16px',
              borderTop: `1px solid ${theme.border}`,
              display: 'flex',
              gap: '8px',
              background: theme.card,
            }}
          >
            <input
              type="text"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={lang === 'fr' ? 'Ecrire un message...' : 'Write a message...'}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '10px',
                border: `1px solid ${theme.border}`,
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                background: theme.primary,
                color: '#fff',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              {lang === 'fr' ? 'Envoyer' : 'Send'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
