import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { notificationSound } from '../utils/ringtones';

interface NotificationContextType {
  unreadMessageCount: number;
  totalBadgeCount: number;
  refreshUnreadCount: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  unreadMessageCount: 0,
  totalBadgeCount: 0,
  refreshUnreadCount: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

interface Props {
  currentUser: any;
  children: React.ReactNode;
}

export const NotificationProvider = ({ currentUser, children }: Props) => {
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      const { data: convos } = await supabase
        .from('conversations')
        .select('id')
        .or(`participant_1_id.eq.${currentUser.id},participant_2_id.eq.${currentUser.id}`);

      if (!convos || convos.length === 0) {
        setUnreadMessageCount(0);
        return;
      }

      const convoIds = convos.map(c => c.id);
      const { count } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .in('conversation_id', convoIds)
        .eq('is_read', false)
        .neq('sender_id', currentUser.id);

      setUnreadMessageCount(count || 0);
    } catch {}
  }, [currentUser?.id]);

  useEffect(() => {
    if (!currentUser?.id) return;
    refreshUnreadCount();

    const msgChannel = supabase
      .channel(`global_msg_notif_${currentUser.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, (payload) => {
        const msg = payload.new as any;
        if (msg.sender_id !== currentUser.id) {
          setUnreadMessageCount(prev => prev + 1);
          notificationSound.playNotificationSound();

          (async () => {
            try {
              const { data: sender } = await supabase
                .from('app_users')
                .select('name')
                .eq('id', msg.sender_id)
                .maybeSingle();

              const senderName = sender?.name || 'Quelqu\'un';
              const contentPreview = msg.message_type === 'image'
                ? 'a envoy\u00E9 une image'
                : msg.message_type === 'audio'
                ? 'a envoy\u00E9 un message vocal'
                : msg.message_type === 'invoice'
                ? 'a envoy\u00E9 une facture'
                : (msg.content?.length > 50 ? msg.content.substring(0, 50) + '...' : msg.content);

              await supabase.from('notifications').insert({
                user_id: currentUser.id,
                type: 'info',
                title: `Nouveau message de ${senderName}`,
                message: contentPreview,
              });
            } catch {}
          })();
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
      }, () => {
        refreshUnreadCount();
      })
      .subscribe();

    return () => {
      msgChannel.unsubscribe();
    };
  }, [currentUser?.id, refreshUnreadCount]);

  const totalBadgeCount = unreadMessageCount;

  return (
    <NotificationContext.Provider value={{
      unreadMessageCount,
      totalBadgeCount,
      refreshUnreadCount,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
