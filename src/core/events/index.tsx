import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useMainStore } from "@/lib/zustand/store";
import { useLogoutService } from "@/hooks/auth/logout";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export function SocketEvents() {
  const { user, setUser } = useMainStore();
  const { logout } = useLogoutService();
  const socketRef = useRef<Socket | null>(null);

  // API/store typically use _id; support both for compatibility
  const userId = user?._id ?? user?.id;

  useEffect(() => {
    if (!userId) {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    if (!SOCKET_URL) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      query: {
        userId,
        username: user?.firstName ?? "",
      },
    });

    socketRef.current = socket;

    socket.emit("join", `user:${userId}`);

    const onUserBlocked = () => {
      toast.error("Your account has been blocked");
      logout();
    };

    const onNotifyCourseCreated = () => {
      toast.success("New notification");
    };

    const onJobSearchStarted = () => {
      toast.success("Job search started");
    };

    const onJobSearchCompleted = (payload: { data?: { user?: unknown } }) => {
      toast.success("Job search completed");
      console.log({payload})
      if (payload?.data?.user != null) setUser(payload.data.user as Parameters<typeof setUser>[0]);
    };

    socket.on("userBlocked", onUserBlocked);
    socket.on("notifyCourseCreated", onNotifyCourseCreated);
    socket.on("jobSearchStarted", onJobSearchStarted);
    socket.on("jobSearchCompleted", onJobSearchCompleted);

    return () => {
      socket.off("userBlocked", onUserBlocked);
      socket.off("notifyCourseCreated", onNotifyCourseCreated);
      socket.off("jobSearchStarted", onJobSearchStarted);
      socket.off("jobSearchCompleted", onJobSearchCompleted);
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- reconnect only when user id changes
  }, [userId, logout]);

  return null;
}
