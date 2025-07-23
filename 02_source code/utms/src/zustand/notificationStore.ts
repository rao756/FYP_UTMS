import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  message: string;
  isActive: boolean;
  createdAt: string;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const useNotificationStore = create<NotificationStore>()(
  devtools(
    persist(
      (set) => ({
        notifications: [],
        addNotification: (notification: Notification) =>
          set((state) => ({
            notifications: [...state.notifications, notification],
          })),
        removeNotification: (id: string) =>
          set((state) => ({
            notifications: state.notifications.filter(
              (notification) => notification.id !== id
            ),
          })),

        clearNotifications: () => set({ notifications: [] }),
      }),
      {
        name: 'notifications',
      }
    )
  )
);

export default useNotificationStore;
