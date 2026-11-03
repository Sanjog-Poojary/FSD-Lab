import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const STORAGE_KEY = "eventHubNotifications";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["polling", "websocket"],
      reconnectionAttempts: 20,
      reconnectionDelay: 1000,
    });

    if (socket.connected) {
      setConnected(true);
    }

    function handleConnect() {
      setConnected(true);
      console.log("Connected to EventHub notifications via Socket.IO");
    }

    function handleDisconnect() {
      setConnected(false);
      console.log("Disconnected from EventHub notifications");
    }

    function handleConnectError(err) {
      console.warn("Socket connection error:", err.message);
      setConnected(false);
    }

    function addNotification(notification) {
      const newNotification = {
        ...notification,
        id: `${Date.now()}-${Math.random()}`,
      };

      setNotifications((previous) => {
        const updated = [newNotification, ...previous].slice(0, 50);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (err) {
          console.warn("Failed to save notifications to localStorage:", err);
        }
        return updated;
      });
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("event:created", addNotification);
    socket.on("event:updated", addNotification);
    socket.on("event:deleted", addNotification);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("event:created", addNotification);
      socket.off("event:updated", addNotification);
      socket.off("event:deleted", addNotification);
      socket.disconnect();
    };
  }, []);

  function clearNotifications() {
    setNotifications([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn("Failed to clear notifications from localStorage:", err);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className="relative rounded-lg px-3 py-2 text-white transition hover:bg-slate-700"
      >
        <span className="text-xl" aria-hidden="true">🔔</span>
        {notifications.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
            {notifications.length > 99 ? "99+" : notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-80 max-w-[90vw] rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-bold">Notifications</h2>
            <button
              type="button"
              onClick={clearNotifications}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Clear all
            </button>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Connection:{" "}
            <span className={connected ? "font-semibold text-green-600" : "font-semibold text-red-500"}>
              {connected ? "Connected" : "Disconnected"}
            </span>
          </p>

          <div className="mt-3 max-h-80 space-y-3 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                No notifications yet.
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-lg bg-slate-50 p-3"
                >
                  <p className="text-sm font-medium">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
