'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/hooks/useGameStore';
import { toast } from 'sonner';
import { Notification } from '@/lib/store';
import { Trophy, Flame, Star, TrendingUp, X } from 'lucide-react';

export function NotifToast() {
  const { notifications, dismissNotification } = useGameStore();

  useEffect(() => {
    notifications.forEach((notification) => {
      const icon = getNotificationIcon(notification.type);
      
      toast.custom(
        (t) => (
          <div
            className={`flex items-center gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-lg ${
              notification.type === 'level_up'
                ? 'bg-yellow-500/20 border-yellow-500/50'
                : notification.type === 'challenge'
                ? 'bg-green-500/20 border-green-500/50'
                : notification.type === 'streak'
                ? 'bg-orange-500/20 border-orange-500/50'
                : 'bg-blue-500/20 border-blue-500/50'
            }`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{notification.title}</div>
              <div className="text-xs text-muted-foreground truncate">{notification.message}</div>
            </div>
            <button
              onClick={() => {
                dismissNotification(notification.id);
                toast.dismiss(t);
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ),
        {
          duration: 4000,
        }
      );

      dismissNotification(notification.id);
    });
  }, [notifications, dismissNotification]);

  return null;
}

function getNotificationIcon(type: Notification['type']) {
  switch (type) {
    case 'level_up':
      return <Trophy className="h-5 w-5 text-yellow-400 flex-shrink-0" />;
    case 'challenge':
      return <Star className="h-5 w-5 text-green-400 flex-shrink-0" />;
    case 'streak':
      return <Flame className="h-5 w-5 text-orange-400 flex-shrink-0" />;
    case 'xp':
      return <TrendingUp className="h-5 w-5 text-blue-400 flex-shrink-0" />;
    default:
      return <Trophy className="h-5 w-5 flex-shrink-0" />;
  }
}
